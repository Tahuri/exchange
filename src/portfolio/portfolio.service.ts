import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Position } from '../entities/position.entity';
import { MarketData } from '../entities/marketdata.entity';
import { Instrument } from '../entities/instrument.entity';

export interface PortfolioPosition {
  id: number;
  instrumentId: number;
  ticker: string;
  name: string;
  type: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  marketValue: number;
  totalReturn: number;
  totalReturnPercentage: number;
  dailyReturn: number;
  dailyReturnPercentage: number;
}

export interface PortfolioSummary {
  userId: number;
  userEmail: string;
  accountNumber: string;
  totalPortfolioValue: number;
  availableCash: number;
  totalInvestedValue: number;
  totalReturn: number;
  totalReturnPercentage: number;
  positions: PortfolioPosition[];
}

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Position)
    private positionsRepository: Repository<Position>,
    @InjectRepository(MarketData)
    private marketDataRepository: Repository<MarketData>,
    @InjectRepository(Instrument)
    private instrumentsRepository: Repository<Instrument>,
  ) {}

  async getUserPortfolio(userId: number): Promise<PortfolioSummary> {
    // Verificar que el usuario existe
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Obtener todas las posiciones del usuario con información del instrumento
    const positions = await this.positionsRepository.find({
      where: { userId },
      relations: ['instrument'],
      order: { instrumentId: 'ASC' }
    });

    // Obtener datos de mercado para calcular precios actuales
    const portfolioPositions: PortfolioPosition[] = [];
    let totalInvestedValue = 0;
    let totalMarketValue = 0;
    let totalReturn = 0;

    for (const position of positions) {
      if (position.quantity > 0 && position.instrumentId !== 66) {
        // Obtener el último precio del instrumento
        const latestMarketData = await this.marketDataRepository.findOne({
          where: { instrumentId: position.instrumentId },
          order: { date: 'DESC' }
        });

        const currentPrice = latestMarketData?.close || position.averagePrice;
        const marketValue = position.quantity * currentPrice;
        const investedValue = position.quantity * position.averagePrice;
        const positionReturn = marketValue - investedValue;
        const totalReturnPercentage = investedValue > 0 ? (positionReturn / investedValue) * 100 : 0;

        // Calcular rendimiento diario
        const dailyReturn = latestMarketData?.close && latestMarketData?.previousClose 
          ? (latestMarketData.close - latestMarketData.previousClose) * position.quantity
          : 0;
        const dailyReturnPercentage = latestMarketData?.previousClose 
          ? ((latestMarketData.close - latestMarketData.previousClose) / latestMarketData.previousClose) * 100
          : 0;

        portfolioPositions.push({
          id: position.id,
          instrumentId: position.instrumentId,
          ticker: position.instrument.ticker,
          name: position.instrument.name,
          type: position.instrument.type,
          quantity: position.quantity,
          averagePrice: position.averagePrice,
          currentPrice: currentPrice,
          marketValue: marketValue,
          totalReturn: positionReturn,
          totalReturnPercentage: totalReturnPercentage,
          dailyReturn: dailyReturn,
          dailyReturnPercentage: dailyReturnPercentage,
        });

        totalInvestedValue += investedValue;
        totalMarketValue += marketValue;
        totalReturn += positionReturn;
      }
    }

    // Obtener pesos disponibles (posición en ARS)
    const cashPosition = positions.find(p => p.instrumentId === 66); // ID del instrumento ARS
    const availableCash = cashPosition?.quantity || 0;

    // Calcular valor total del portfolio (incluyendo cash)
    const totalPortfolioValue = totalMarketValue + availableCash;
    const totalReturnPercentage = totalInvestedValue > 0 ? (totalReturn / totalInvestedValue) * 100 : 0;

    return {
      userId: user.id,
      userEmail: user.email,
      accountNumber: user.accountNumber,
      totalPortfolioValue: totalPortfolioValue,
      availableCash: availableCash,
      totalInvestedValue: totalInvestedValue,
      totalReturn: totalReturn,
      totalReturnPercentage: totalReturnPercentage,
      positions: portfolioPositions,
    };
  }

  async getUserPortfolioSummary(userId: number): Promise<any> {
    const portfolio = await this.getUserPortfolio(userId);
    
    return {
      userId: portfolio.userId,
      userEmail: portfolio.userEmail,
      accountNumber: portfolio.accountNumber,
      totalPortfolioValue: portfolio.totalPortfolioValue,
      availableCash: portfolio.availableCash,
      totalInvestedValue: portfolio.totalInvestedValue,
      totalReturn: portfolio.totalReturn,
      totalReturnPercentage: portfolio.totalReturnPercentage,
      positionsCount: portfolio.positions.length,
    };
  }

  async getPositionDetails(userId: number, instrumentId: number): Promise<PortfolioPosition | null> {
    const position = await this.positionsRepository.findOne({
      where: { userId, instrumentId },
      relations: ['instrument']
    });

    if (!position || position.quantity === 0) {
      return null;
    }

    // Obtener el último precio del instrumento
    const latestMarketData = await this.marketDataRepository.findOne({
      where: { instrumentId: position.instrumentId },
      order: { date: 'DESC' }
    });

    const currentPrice = latestMarketData?.close || position.averagePrice;
    const marketValue = position.quantity * currentPrice;
    const investedValue = position.quantity * position.averagePrice;
    const positionReturn = marketValue - investedValue;
    const totalReturnPercentage = investedValue > 0 ? (positionReturn / investedValue) * 100 : 0;

    // Calcular rendimiento diario
    const dailyReturn = latestMarketData?.close && latestMarketData?.previousClose 
      ? (latestMarketData.close - latestMarketData.previousClose) * position.quantity
      : 0;
    const dailyReturnPercentage = latestMarketData?.previousClose 
      ? ((latestMarketData.close - latestMarketData.previousClose) / latestMarketData.previousClose) * 100
      : 0;

    return {
      id: position.id,
      instrumentId: position.instrumentId,
      ticker: position.instrument.ticker,
      name: position.instrument.name,
      type: position.instrument.type,
      quantity: position.quantity,
      averagePrice: position.averagePrice,
      currentPrice: currentPrice,
      marketValue: marketValue,
      totalReturn: positionReturn,
      totalReturnPercentage: totalReturnPercentage,
      dailyReturn: dailyReturn,
      dailyReturnPercentage: dailyReturnPercentage,
    };
  }
} 