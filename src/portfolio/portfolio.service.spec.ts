import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PortfolioService } from './portfolio.service';
import { Position } from '../entities/position.entity';
import { User } from '../entities/user.entity';
import { Instrument } from '../entities/instrument.entity';
import { MarketData } from '../entities/marketdata.entity';

describe('PortfolioService', () => {
  let service: PortfolioService;
  let positionsRepository: any;
  let usersRepository: any;
  let instrumentsRepository: any;
  let marketDataRepository: any;

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

  const mockPosition = {
    id: 1,
    userId: 1,
    instrumentId: 47,
    quantity: 100,
    averagePrice: 1000,
    marketValue: 106325,
    dailyReturn: 0.5,
    totalReturn: 6.3,
    instrument: mockInstrument,
  };

  const mockMarketData = {
    id: 1,
    instrumentId: 47,
    date: '2024-01-31',
    close: 1063.25,
    previousClose: 1058.00,
  };

  const mockRepositories = {
    positionsRepository: {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    },
    usersRepository: {
      findOne: jest.fn(),
    },
    instrumentsRepository: {
      find: jest.fn(),
      findOne: jest.fn(),
    },
    marketDataRepository: {
      find: jest.fn(),
      findOne: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PortfolioService,
        {
          provide: getRepositoryToken(Position),
          useValue: mockRepositories.positionsRepository,
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
      ],
    }).compile();

    service = module.get<PortfolioService>(PortfolioService);
    positionsRepository = mockRepositories.positionsRepository;
    usersRepository = mockRepositories.usersRepository;
    instrumentsRepository = mockRepositories.instrumentsRepository;
    marketDataRepository = mockRepositories.marketDataRepository;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserPortfolio', () => {
    it('should return portfolio with positions and calculations', async () => {
      const positions = [mockPosition];
      const marketData = mockMarketData;

      usersRepository.findOne.mockResolvedValue(mockUser);
      positionsRepository.find.mockResolvedValue(positions);
      marketDataRepository.findOne.mockResolvedValue(marketData);

      const result = await service.getUserPortfolio(1);

      expect(result).toHaveProperty('totalPortfolioValue');
      expect(result).toHaveProperty('availableCash');
      expect(result).toHaveProperty('totalInvestedValue');
      expect(result).toHaveProperty('totalReturn');
      expect(result).toHaveProperty('totalReturnPercentage');
      expect(result).toHaveProperty('positions');
      expect(result.positions).toHaveLength(1);
      expect(result.positions[0]).toHaveProperty('ticker');
      expect(result.positions[0]).toHaveProperty('name');
      expect(result.positions[0]).toHaveProperty('quantity');
      expect(result.positions[0]).toHaveProperty('marketValue');
      expect(result.positions[0]).toHaveProperty('totalReturnPercentage');
    });

    it('should handle user with no positions', async () => {
      usersRepository.findOne.mockResolvedValue(mockUser);
      positionsRepository.find.mockResolvedValue([]);

      const result = await service.getUserPortfolio(1);

      expect(result.totalPortfolioValue).toBe(0);
      expect(result.availableCash).toBe(0);
      expect(result.totalInvestedValue).toBe(0);
      expect(result.positions).toHaveLength(0);
    });

    it('should calculate cash position correctly', async () => {
      const cashPosition = {
        id: 2,
        userId: 1,
        instrumentId: 66, // ARS
        quantity: 50000,
        averagePrice: 1,
        marketValue: 50000,
        dailyReturn: 0,
        totalReturn: 0,
        instrument: { ...mockInstrument, id: 66, ticker: 'ARS', name: 'PESOS' },
      };

      const positions = [cashPosition];

      usersRepository.findOne.mockResolvedValue(mockUser);
      positionsRepository.find.mockResolvedValue(positions);

      const result = await service.getUserPortfolio(1);

      console.log('Result:', JSON.stringify(result, null, 2));
      expect(result.availableCash).toBe(50000);
      expect(result.totalPortfolioValue).toBe(50000);
      expect(result.totalInvestedValue).toBe(0);
      expect(result.totalReturn).toBe(0);
    });

    it('should calculate total returns correctly', async () => {
      const positionWithReturns = {
        ...mockPosition,
        quantity: 100,
        averagePrice: 1000,
        marketValue: 106325,
        totalReturn: 6.3,
      };

      const positions = [positionWithReturns];
      const marketData = mockMarketData;

      usersRepository.findOne.mockResolvedValue(mockUser);
      positionsRepository.find.mockResolvedValue(positions);
      marketDataRepository.findOne.mockResolvedValue(marketData);

      const result = await service.getUserPortfolio(1);

      expect(result.positions[0].totalReturnPercentage).toBeGreaterThan(0);
      expect(result.positions[0].marketValue).toBe(106325);
    });

    it('should handle missing market data', async () => {
      const positions = [mockPosition];

      usersRepository.findOne.mockResolvedValue(mockUser);
      positionsRepository.find.mockResolvedValue(positions);
      marketDataRepository.findOne.mockResolvedValue(null);

      const result = await service.getUserPortfolio(1);

      expect(result.positions[0].currentPrice).toBe(1000); // averagePrice
      expect(result.positions[0].marketValue).toBe(100000); // averagePrice * quantity
    });

    it('should throw error when user not found', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      await expect(service.getUserPortfolio(999)).rejects.toThrow('User with ID 999 not found');
    });
  });

  describe('getUserPortfolioSummary', () => {
    it('should return portfolio summary', async () => {
      const portfolio = {
        userId: 1,
        userEmail: 'test@example.com',
        accountNumber: '10001',
        totalPortfolioValue: 106325,
        availableCash: 50000,
        totalInvestedValue: 100000,
        totalReturn: 6325,
        totalReturnPercentage: 6.3,
        positions: [{
          id: 1,
          instrumentId: 47,
          ticker: 'YPFD',
          name: 'Y.P.F. S.A.',
          type: 'ACCIONES',
          quantity: 100,
          averagePrice: 1000,
          currentPrice: 1063.25,
          marketValue: 106325,
          totalReturn: 6325,
          totalReturnPercentage: 6.3,
          dailyReturn: 525,
          dailyReturnPercentage: 0.5,
        }],
      };

      jest.spyOn(service, 'getUserPortfolio').mockResolvedValue(portfolio);

      const result = await service.getUserPortfolioSummary(1);

      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('userEmail');
      expect(result).toHaveProperty('accountNumber');
      expect(result).toHaveProperty('totalPortfolioValue');
      expect(result).toHaveProperty('availableCash');
      expect(result).toHaveProperty('totalInvestedValue');
      expect(result).toHaveProperty('totalReturn');
      expect(result).toHaveProperty('totalReturnPercentage');
      expect(result).toHaveProperty('positionsCount');
    });
  });

  describe('getPositionDetails', () => {
    it('should return position details', async () => {
      const position = mockPosition;
      const marketData = mockMarketData;

      positionsRepository.findOne.mockResolvedValue(position);
      marketDataRepository.findOne.mockResolvedValue(marketData);

      const result = await service.getPositionDetails(1, 47);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('instrumentId');
      expect(result).toHaveProperty('ticker');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('quantity');
      expect(result).toHaveProperty('marketValue');
      expect(result).toHaveProperty('totalReturnPercentage');
    });

    it('should return null when position not found', async () => {
      positionsRepository.findOne.mockResolvedValue(null);

      const result = await service.getPositionDetails(1, 999);

      expect(result).toBeNull();
    });

    it('should return null when position quantity is zero', async () => {
      const zeroPosition = { ...mockPosition, quantity: 0 };
      positionsRepository.findOne.mockResolvedValue(zeroPosition);

      const result = await service.getPositionDetails(1, 47);

      expect(result).toBeNull();
    });
  });
}); 