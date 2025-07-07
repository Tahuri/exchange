import { Test, TestingModule } from '@nestjs/testing';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';

describe('PortfolioController', () => {
  let controller: PortfolioController;
  let service: PortfolioService;

  const mockPortfolio = {
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

  const mockPortfolioSummary = {
    userId: 1,
    userEmail: 'test@example.com',
    accountNumber: '10001',
    totalPortfolioValue: 106325,
    availableCash: 50000,
    totalInvestedValue: 100000,
    totalReturn: 6325,
    totalReturnPercentage: 6.3,
    positionsCount: 1,
  };

  const mockPositionDetails = {
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
  };

  const mockPortfolioService = {
    getUserPortfolio: jest.fn(),
    getUserPortfolioSummary: jest.fn(),
    getPositionDetails: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PortfolioController],
      providers: [
        {
          provide: PortfolioService,
          useValue: mockPortfolioService,
        },
      ],
    }).compile();

    controller = module.get<PortfolioController>(PortfolioController);
    service = module.get<PortfolioService>(PortfolioService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUserPortfolio', () => {
    it('should return user portfolio', async () => {
      mockPortfolioService.getUserPortfolio.mockResolvedValue(mockPortfolio);

      const result = await controller.getUserPortfolio(1);

      expect(result).toEqual(mockPortfolio);
      expect(service.getUserPortfolio).toHaveBeenCalledWith(1);
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockPortfolioService.getUserPortfolio.mockRejectedValue(error);

      await expect(controller.getUserPortfolio(1)).rejects.toThrow('Service error');
    });
  });

  describe('getUserPortfolioSummary', () => {
    it('should return user portfolio summary', async () => {
      mockPortfolioService.getUserPortfolioSummary.mockResolvedValue(mockPortfolioSummary);

      const result = await controller.getUserPortfolioSummary(1);

      expect(result).toEqual(mockPortfolioSummary);
      expect(service.getUserPortfolioSummary).toHaveBeenCalledWith(1);
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockPortfolioService.getUserPortfolioSummary.mockRejectedValue(error);

      await expect(controller.getUserPortfolioSummary(1)).rejects.toThrow('Service error');
    });
  });

  describe('getPositionDetails', () => {
    it('should return position details', async () => {
      mockPortfolioService.getPositionDetails.mockResolvedValue(mockPositionDetails);

      const result = await controller.getPositionDetails(1, 47);

      expect(result).toEqual(mockPositionDetails);
      expect(service.getPositionDetails).toHaveBeenCalledWith(1, 47);
    });

    it('should return null when position not found', async () => {
      mockPortfolioService.getPositionDetails.mockResolvedValue(null);

      const result = await controller.getPositionDetails(1, 999);

      expect(result).toBeNull();
      expect(service.getPositionDetails).toHaveBeenCalledWith(1, 999);
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockPortfolioService.getPositionDetails.mockRejectedValue(error);

      await expect(controller.getPositionDetails(1, 47)).rejects.toThrow('Service error');
    });
  });
}); 