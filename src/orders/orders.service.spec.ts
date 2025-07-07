import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { OrdersService } from './orders.service';
import { Order } from '../entities/order.entity';
import { User } from '../entities/user.entity';
import { Instrument } from '../entities/instrument.entity';
import { MarketData } from '../entities/marketdata.entity';
import { Position } from '../entities/position.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('OrdersService', () => {
  let service: OrdersService;
  let ordersRepository: any;
  let usersRepository: any;
  let instrumentsRepository: any;
  let marketDataRepository: any;
  let positionsRepository: any;
  let dataSource: DataSource;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    accountNumber: '10001',
  };

  const mockInstrument = {
    id: 47,
    ticker: 'YPFD',
    name: 'Y.P.F. S.A.',
    type: 'ACCIONES',
  };

  const mockMarketData = {
    id: 1,
    instrumentId: 47,
    date: '2024-01-31',
    close: 1063.25,
    previousClose: 1058.00,
  };

  const mockOrder = {
    id: 1,
    userId: 1,
    instrumentId: 47,
    size: 10,
    price: 1063.25,
    type: 'MARKET',
    side: 'BUY',
    status: 'FILLED',
    datetime: new Date(),
  };

  const mockPosition = {
    id: 1,
    userId: 1,
    instrumentId: 47,
    quantity: 100,
    averagePrice: 1000,
    marketValue: 106325,
    dailyReturn: 0.5,
    totalReturn: 6.3,
  };

  const mockArsPosition = {
    id: 2,
    userId: 1,
    instrumentId: 66,
    quantity: 1000000,
    averagePrice: 1,
    marketValue: 1000000,
    dailyReturn: 0,
    totalReturn: 0,
  };

  const mockRepositories = {
    ordersRepository: {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    usersRepository: {
      findOne: jest.fn(),
    },
    instrumentsRepository: {
      findOne: jest.fn(),
    },
    marketDataRepository: {
      findOne: jest.fn(),
    },
    positionsRepository: {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockDataSource = {
    createQueryRunner: jest.fn(() => ({
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockRepositories.ordersRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockRepositories.usersRepository,
        },
        {
          provide: getRepositoryToken(Instrument),
          useValue: mockRepositories.instrumentsRepository,
        },
        {
          provide: getRepositoryToken(MarketData),
          useValue: mockRepositories.marketDataRepository,
        },
        {
          provide: getRepositoryToken(Position),
          useValue: mockRepositories.positionsRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    ordersRepository = mockRepositories.ordersRepository;
    usersRepository = mockRepositories.usersRepository;
    instrumentsRepository = mockRepositories.instrumentsRepository;
    marketDataRepository = mockRepositories.marketDataRepository;
    positionsRepository = mockRepositories.positionsRepository;
    dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create a market buy order successfully', async () => {
      const orderData = {
        userId: 1,
        instrumentId: 47,
        size: 10,
        type: 'MARKET' as const,
        side: 'BUY' as const,
      };

      usersRepository.findOne.mockResolvedValue(mockUser);
      instrumentsRepository.findOne.mockResolvedValue(mockInstrument);
      marketDataRepository.findOne.mockResolvedValue(mockMarketData);
      positionsRepository.findOne.mockImplementation(({ where }) => {
        if (where.instrumentId === 66) return mockArsPosition;
        if (where.instrumentId === 47) return mockPosition;
        return null;
      });
      ordersRepository.create.mockReturnValue(mockOrder);
      ordersRepository.save.mockResolvedValue(mockOrder);

      const result = await service.createOrder(orderData);

      expect(result).toEqual(mockOrder);
      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(instrumentsRepository.findOne).toHaveBeenCalledWith({ where: { id: 47 } });
      expect(marketDataRepository.findOne).toHaveBeenCalledWith({
        where: { instrumentId: 47 },
        order: { date: 'DESC' }
      });
    });

    it('should create a limit buy order successfully', async () => {
      const orderData = {
        userId: 1,
        instrumentId: 47,
        size: 10,
        price: 1000,
        type: 'LIMIT' as const,
        side: 'BUY' as const,
      };

      const limitOrder = { ...mockOrder, type: 'LIMIT', status: 'NEW', price: 1000 };

      usersRepository.findOne.mockResolvedValue(mockUser);
      instrumentsRepository.findOne.mockResolvedValue(mockInstrument);
      ordersRepository.create.mockReturnValue(limitOrder);
      ordersRepository.save.mockResolvedValue(limitOrder);

      const result = await service.createOrder(orderData);

      expect(result).toEqual(limitOrder);
      expect(result.status).toBe('NEW');
    });

    it('should create a cash in order successfully', async () => {
      const orderData = {
        userId: 1,
        instrumentId: 66, // ARS
        size: 1000000,
        type: 'MARKET' as const,
        side: 'CASH_IN' as const,
      };

      const cashOrder = { ...mockOrder, side: 'CASH_IN', instrumentId: 66, size: 1000000 };
      usersRepository.findOne.mockResolvedValue(mockUser);
      instrumentsRepository.findOne.mockResolvedValue({ ...mockInstrument, id: 66 });
      ordersRepository.create.mockReturnValue(cashOrder);
      ordersRepository.save.mockResolvedValue(cashOrder);
      positionsRepository.findOne.mockImplementation(({ where }) => {
        if (where.instrumentId === 66) return { ...mockArsPosition };
        return null;
      });
      positionsRepository.save.mockResolvedValue({ ...mockArsPosition, quantity: 2000000 });

      const result = await service.createOrder(orderData);

      expect(result).toEqual(cashOrder);
      expect(result.status).toBe('FILLED');
    });

    it('should throw NotFoundException when user not found', async () => {
      const orderData = {
        userId: 999,
        instrumentId: 47,
        size: 10,
        type: 'MARKET' as const,
        side: 'BUY' as const,
      };

      usersRepository.findOne.mockResolvedValue(null);

      await expect(service.createOrder(orderData)).rejects.toThrow(NotFoundException);
      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    });

    it('should throw NotFoundException when instrument not found', async () => {
      const orderData = {
        userId: 1,
        instrumentId: 999,
        size: 10,
        type: 'MARKET' as const,
        side: 'BUY' as const,
      };

      usersRepository.findOne.mockResolvedValue(mockUser);
      instrumentsRepository.findOne.mockResolvedValue(null);

      await expect(service.createOrder(orderData)).rejects.toThrow(NotFoundException);
      expect(instrumentsRepository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    });

    it('should throw BadRequestException when no market data available', async () => {
      const orderData = {
        userId: 1,
        instrumentId: 47,
        size: 10,
        type: 'MARKET' as const,
        side: 'BUY' as const,
      };

      usersRepository.findOne.mockResolvedValue(mockUser);
      instrumentsRepository.findOne.mockResolvedValue(mockInstrument);
      marketDataRepository.findOne.mockResolvedValue(null);

      await expect(service.createOrder(orderData)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when price is required for LIMIT orders', async () => {
      const orderData = {
        userId: 1,
        instrumentId: 47,
        size: 10,
        type: 'LIMIT' as const,
        side: 'BUY' as const,
      };

      usersRepository.findOne.mockResolvedValue(mockUser);
      instrumentsRepository.findOne.mockResolvedValue(mockInstrument);

      await expect(service.createOrder(orderData)).rejects.toThrow(BadRequestException);
    });

    it('should calculate size from amount for MARKET orders', async () => {
      const orderData = {
        userId: 1,
        instrumentId: 47,
        amount: 10000, // 10000 pesos
        type: 'MARKET' as const,
        side: 'BUY' as const,
      };

      const calculatedOrder = { ...mockOrder, size: 9, price: 1063.25 }; // 10000 / 1063.25 = 9

      usersRepository.findOne.mockResolvedValue(mockUser);
      instrumentsRepository.findOne.mockResolvedValue(mockInstrument);
      marketDataRepository.findOne.mockResolvedValue(mockMarketData);
      positionsRepository.findOne.mockImplementation(({ where }) => {
        if (where.instrumentId === 66) return mockArsPosition;
        if (where.instrumentId === 47) return mockPosition;
        return null;
      });
      ordersRepository.create.mockReturnValue(calculatedOrder);
      ordersRepository.save.mockResolvedValue(calculatedOrder);

      const result = await service.createOrder(orderData);

      expect(result.size).toBe(9);
      expect(result.price).toBe(1063.25);
    });

    it('should throw BadRequestException when amount is too low', async () => {
      const orderData = {
        userId: 1,
        instrumentId: 47,
        amount: 100, // Muy bajo para comprar acciones
        type: 'MARKET' as const,
        side: 'BUY' as const,
      };

      usersRepository.findOne.mockResolvedValue(mockUser);
      instrumentsRepository.findOne.mockResolvedValue(mockInstrument);
      marketDataRepository.findOne.mockResolvedValue(mockMarketData);

      await expect(service.createOrder(orderData)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getUserOrders', () => {
    it('should return user orders', async () => {
      const orders = [mockOrder];
      ordersRepository.find.mockResolvedValue(orders);
      const expectedParams = {
        where: { userId: 1 },
        order: { datetime: 'DESC' },
        relations: ['instrument'],
      };
      await service.getUserOrders(1);
      expect(ordersRepository.find).toHaveBeenCalledWith(expectedParams);
    });
  });

  describe('getUserPendingOrders', () => {
    it('should return user pending orders', async () => {
      const pendingOrders = [{ ...mockOrder, status: 'NEW' }];
      ordersRepository.find.mockResolvedValue(pendingOrders);
      const expectedParams = {
        where: { userId: 1, status: 'NEW' },
        order: { datetime: 'ASC' },
        relations: ['instrument'],
      };
      await service.getUserPendingOrders(1);
      expect(ordersRepository.find).toHaveBeenCalledWith(expectedParams);
    });
  });

  describe('getUserPositions', () => {
    it('should return user positions', async () => {
      const positions = [mockPosition];
      positionsRepository.find.mockResolvedValue(positions);
      const expectedParams = {
        where: { userId: 1 },
        order: { instrumentId: 'ASC' },
        relations: ['instrument'],
      };
      await service.getUserPositions(1);
      expect(positionsRepository.find).toHaveBeenCalledWith(expectedParams);
    });
  });

  describe('cancelOrder', () => {
    it('should cancel an order successfully', async () => {
      const orderToCancel = { ...mockOrder, status: 'NEW' };
      const cancelledOrder = { ...orderToCancel, status: 'CANCELLED' };
      
      ordersRepository.findOne.mockResolvedValue(orderToCancel);
      ordersRepository.save.mockResolvedValue(cancelledOrder);

      const result = await service.cancelOrder(1, 1);

      expect(result.status).toBe('CANCELLED');
      expect(ordersRepository.save).toHaveBeenCalledWith(cancelledOrder);
    });

    it('should throw NotFoundException when order not found', async () => {
      ordersRepository.findOne.mockResolvedValue(null);
      await expect(service.cancelOrder(999, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if order is not NEW', async () => {
      const orderToCancel = { ...mockOrder, status: 'FILLED' };
      ordersRepository.findOne.mockResolvedValue(orderToCancel);
      await expect(service.cancelOrder(1, 1)).rejects.toThrow(BadRequestException);
    });
  });
}); 