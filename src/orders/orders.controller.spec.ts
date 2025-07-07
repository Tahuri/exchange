import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

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

  const mockOrdersService = {
    createOrder: jest.fn(),
    getUserOrders: jest.fn(),
    getUserPendingOrders: jest.fn(),
    getUserPositions: jest.fn(),
    cancelOrder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create a market buy order', async () => {
      const orderData = {
        userId: 1,
        instrumentId: 47,
        size: 10,
        type: 'MARKET' as const,
        side: 'BUY' as const,
      };

      mockOrdersService.createOrder.mockResolvedValue(mockOrder);

      const result = await controller.createOrder(orderData);

      expect(result).toEqual(mockOrder);
      expect(service.createOrder).toHaveBeenCalledWith(orderData);
    });

    it('should create a limit sell order', async () => {
      const orderData = {
        userId: 1,
        instrumentId: 47,
        size: 10,
        price: 1100,
        type: 'LIMIT' as const,
        side: 'SELL' as const,
      };

      const limitOrder = { ...mockOrder, type: 'LIMIT', side: 'SELL', price: 1100, status: 'NEW' };
      mockOrdersService.createOrder.mockResolvedValue(limitOrder);

      const result = await controller.createOrder(orderData);

      expect(result).toEqual(limitOrder);
      expect(service.createOrder).toHaveBeenCalledWith(orderData);
    });

    it('should create a cash in order', async () => {
      const orderData = {
        userId: 1,
        instrumentId: 66,
        size: 1000000,
        type: 'MARKET' as const,
        side: 'CASH_IN' as const,
      };

      const cashOrder = { ...mockOrder, side: 'CASH_IN', instrumentId: 66, size: 1000000 };
      mockOrdersService.createOrder.mockResolvedValue(cashOrder);

      const result = await controller.createOrder(orderData);

      expect(result).toEqual(cashOrder);
      expect(service.createOrder).toHaveBeenCalledWith(orderData);
    });

    it('should handle service errors', async () => {
      const orderData = {
        userId: 1,
        instrumentId: 47,
        size: 10,
        type: 'MARKET' as const,
        side: 'BUY' as const,
      };

      const error = new Error('Service error');
      mockOrdersService.createOrder.mockRejectedValue(error);

      await expect(controller.createOrder(orderData)).rejects.toThrow('Service error');
    });
  });

  describe('getUserOrders', () => {
    it('should return user orders', async () => {
      const orders = [mockOrder];
      mockOrdersService.getUserOrders.mockResolvedValue(orders);

      const result = await controller.getUserOrders(1);

      expect(result).toEqual(orders);
      expect(service.getUserOrders).toHaveBeenCalledWith(1);
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockOrdersService.getUserOrders.mockRejectedValue(error);

      await expect(controller.getUserOrders(1)).rejects.toThrow('Service error');
    });
  });

  describe('getUserPendingOrders', () => {
    it('should return user pending orders', async () => {
      const pendingOrders = [{ ...mockOrder, status: 'NEW' }];
      mockOrdersService.getUserPendingOrders.mockResolvedValue(pendingOrders);

      const result = await controller.getUserPendingOrders(1);

      expect(result).toEqual(pendingOrders);
      expect(service.getUserPendingOrders).toHaveBeenCalledWith(1);
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockOrdersService.getUserPendingOrders.mockRejectedValue(error);

      await expect(controller.getUserPendingOrders(1)).rejects.toThrow('Service error');
    });
  });

  describe('getUserPositions', () => {
    it('should return user positions', async () => {
      const positions = [
        {
          id: 1,
          userId: 1,
          instrumentId: 47,
          quantity: 100,
          averagePrice: 1000,
          marketValue: 106325,
          dailyReturn: 0.5,
          totalReturn: 6.3,
        }
      ];
      mockOrdersService.getUserPositions.mockResolvedValue(positions);

      const result = await controller.getUserPositions(1);

      expect(result).toEqual(positions);
      expect(service.getUserPositions).toHaveBeenCalledWith(1);
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockOrdersService.getUserPositions.mockRejectedValue(error);

      await expect(controller.getUserPositions(1)).rejects.toThrow('Service error');
    });
  });

  describe('cancelOrder', () => {
    it('should cancel an order', async () => {
      const cancelledOrder = { ...mockOrder, status: 'CANCELLED' };
      mockOrdersService.cancelOrder.mockResolvedValue(cancelledOrder);

      const result = await controller.cancelOrder(1, 1);

      expect(result).toEqual(cancelledOrder);
      expect(service.cancelOrder).toHaveBeenCalledWith(1, 1);
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockOrdersService.cancelOrder.mockRejectedValue(error);

      await expect(controller.cancelOrder(1, 1)).rejects.toThrow('Service error');
    });
  });
}); 