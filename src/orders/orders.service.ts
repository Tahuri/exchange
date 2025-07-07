import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from '../entities/order.entity';
import { User } from '../entities/user.entity';
import { Instrument } from '../entities/instrument.entity';
import { MarketData } from '../entities/marketdata.entity';
import { Position } from '../entities/position.entity';

export interface CreateOrderDto {
  instrumentId: number;
  userId: number;
  size?: number;
  amount?: number; // Monto en pesos para calcular cantidad
  price?: number; // Solo para órdenes LIMIT
  type: 'MARKET' | 'LIMIT';
  side: 'BUY' | 'SELL' | 'CASH_IN' | 'CASH_OUT';
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Instrument)
    private instrumentsRepository: Repository<Instrument>,
    @InjectRepository(MarketData)
    private marketDataRepository: Repository<MarketData>,
    @InjectRepository(Position)
    private positionsRepository: Repository<Position>,
    private dataSource: DataSource,
  ) {}

  async createOrder(orderData: CreateOrderDto): Promise<Order> {
    const { userId, instrumentId, type, side, size, amount, price } = orderData;

    // Validar que el usuario existe
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Validar que el instrumento existe
    const instrument = await this.instrumentsRepository.findOne({ where: { id: instrumentId } });
    if (!instrument) {
      throw new NotFoundException(`Instrument with ID ${instrumentId} not found`);
    }

    let finalSize = size || 0;
    let finalPrice = price || 0;

    // Para órdenes de compra/venta (no transferencias)
    if (side === 'BUY' || side === 'SELL') {
      // Obtener el precio actual del instrumento
      const marketData = await this.marketDataRepository.findOne({
        where: { instrumentId },
        order: { date: 'DESC' }
      });

      if (!marketData) {
        throw new BadRequestException('No market data available for this instrument');
      }

      // Si se proporciona amount en lugar de size, calcular la cantidad
      if (amount && !size) {
        // Para órdenes MARKET, usar el precio de cierre
        if (type === 'MARKET') {
          finalPrice = marketData.close;
          finalSize = Math.floor(amount / finalPrice);
        } else {
          // Para órdenes LIMIT, usar el precio especificado
          if (!price) {
            throw new BadRequestException('Price is required for LIMIT orders');
          }
          finalPrice = price;
          finalSize = Math.floor(amount / finalPrice);
        }
        
        if (finalSize <= 0) {
          throw new BadRequestException('Amount is too low to buy any shares');
        }
      }

      if (!finalSize) {
        throw new BadRequestException('Size or amount is required');
      }

      // Para órdenes LIMIT, validar que se proporcione el precio
      if (type === 'LIMIT' && !price) {
        throw new BadRequestException('Price is required for LIMIT orders');
      }

      // Para órdenes MARKET, usar el precio de cierre
      if (type === 'MARKET') {
        finalPrice = marketData.close;
      }

      // Validar fondos/acciones disponibles solo para órdenes MARKET
      if (type === 'MARKET') {
        const hasEnoughFunds = await this.validateOrder(userId, instrumentId, side, finalSize, finalPrice);
        if (!hasEnoughFunds) {
          // Crear orden rechazada
          const rejectedOrder = this.ordersRepository.create({
            ...orderData,
            size: finalSize,
            price: finalPrice,
            status: 'REJECTED',
            datetime: new Date(),
          });
          return this.ordersRepository.save(rejectedOrder);
        }
      }
    }

    // Determinar el estado inicial de la orden
    let initialStatus: string;
    if (type === 'LIMIT') {
      initialStatus = 'NEW';
    } else {
      initialStatus = 'FILLED';
    }

    // Crear la orden
    const order = this.ordersRepository.create({
      ...orderData,
      size: finalSize,
      price: finalPrice,
      status: initialStatus,
      datetime: new Date(),
    });

    const savedOrder = await this.ordersRepository.save(order);

    // Si la orden se ejecutó (MARKET o transferencias), actualizar posiciones
    if (savedOrder.status === 'FILLED') {
      await this.updatePositions(savedOrder);
    }

    return savedOrder;
  }

  private async validateOrder(userId: number, instrumentId: number, side: string, size: number, price: number): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Obtener posición actual del usuario en este instrumento
      let position = await this.positionsRepository.findOne({
        where: { userId, instrumentId }
      });

      if (!position) {
        position = this.positionsRepository.create({
          userId,
          instrumentId,
          quantity: 0,
          averagePrice: 0,
          marketValue: 0,
          dailyReturn: 0,
          totalReturn: 0,
        });
      }

      // Obtener posición en pesos (ARS)
      const arsPosition = await this.positionsRepository.findOne({
        where: { userId, instrumentId: 66 } // ID del instrumento ARS
      });

      let arsQuantity = 0;
      if (arsPosition) {
        arsQuantity = arsPosition.quantity;
      }

      if (side === 'BUY') {
        const requiredAmount = size * price;
        return arsQuantity >= requiredAmount;
      } else if (side === 'SELL') {
        return position.quantity >= size;
      }

      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async updatePositions(order: Order): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { userId, instrumentId, side, size, price } = order;

      // Obtener o crear posición del instrumento
      let position = await this.positionsRepository.findOne({
        where: { userId, instrumentId }
      });

      if (!position) {
        position = this.positionsRepository.create({
          userId,
          instrumentId,
          quantity: 0,
          averagePrice: 0,
          marketValue: 0,
          dailyReturn: 0,
          totalReturn: 0,
        });
      }

      // Obtener o crear posición en pesos
      let arsPosition = await this.positionsRepository.findOne({
        where: { userId, instrumentId: 66 } // ID del instrumento ARS
      });

      if (!arsPosition) {
        arsPosition = this.positionsRepository.create({
          userId,
          instrumentId: 66,
          quantity: 0,
          averagePrice: 1,
          marketValue: 0,
          dailyReturn: 0,
          totalReturn: 0,
        });
      }

      if (side === 'BUY') {
        const totalCost = size * price;
        
        // Actualizar posición del instrumento
        const newQuantity = position.quantity + size;
        const newAveragePrice = ((position.quantity * position.averagePrice) + totalCost) / newQuantity;
        
        position.quantity = newQuantity;
        position.averagePrice = newAveragePrice;

        // Actualizar posición en pesos
        arsPosition.quantity -= totalCost;

      } else if (side === 'SELL') {
        const totalRevenue = size * price;
        
        // Actualizar posición del instrumento
        position.quantity -= size;

        // Actualizar posición en pesos
        arsPosition.quantity += totalRevenue;

      } else if (side === 'CASH_IN') {
        arsPosition.quantity += size;
      } else if (side === 'CASH_OUT') {
        arsPosition.quantity -= size;
      }

      // Guardar posiciones
      await this.positionsRepository.save(position);
      await this.positionsRepository.save(arsPosition);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async cancelOrder(orderId: number, userId: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId, userId }
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== 'NEW') {
      throw new BadRequestException('Only NEW orders can be cancelled');
    }

    order.status = 'CANCELLED';
    return this.ordersRepository.save(order);
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { userId },
      relations: ['instrument'],
      order: { datetime: 'DESC' }
    });
  }

  async getUserPendingOrders(userId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { userId, status: 'NEW' },
      relations: ['instrument'],
      order: { datetime: 'ASC' }
    });
  }

  async getUserPositions(userId: number): Promise<Position[]> {
    return this.positionsRepository.find({
      where: { userId },
      relations: ['instrument'],
      order: { instrumentId: 'ASC' }
    });
  }

  // Método para ejecutar órdenes LIMIT cuando se cumplan las condiciones del mercado
  async executeLimitOrders(): Promise<void> {
    const pendingOrders = await this.ordersRepository.find({
      where: { status: 'NEW' },
      relations: ['instrument']
    });

    for (const order of pendingOrders) {
      // Aquí se implementaría la lógica para verificar si la orden se puede ejecutar
      // basándose en las condiciones del mercado
      // Por ahora, este método está preparado para futuras implementaciones
    }
  }
} 