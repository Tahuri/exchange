import { Test, TestingModule } from '@nestjs/testing';
import { InstrumentsController } from './instruments.controller';
import { InstrumentsService } from './instruments.service';

describe('InstrumentsController', () => {
  let controller: InstrumentsController;
  let service: InstrumentsService;

  const mockInstrument = {
    id: 1,
    ticker: 'YPFD',
    name: 'Y.P.F. S.A.',
    type: 'ACCIONES',
  };

  const mockInstrumentsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByTicker: jest.fn(),
    findByName: jest.fn(),
    findByType: jest.fn(),
    searchInstruments: jest.fn(),
    getInstrumentWithMarketData: jest.fn(),
    getPopularInstruments: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstrumentsController],
      providers: [
        {
          provide: InstrumentsService,
          useValue: mockInstrumentsService,
        },
      ],
    }).compile();

    controller = module.get<InstrumentsController>(InstrumentsController);
    service = module.get<InstrumentsService>(InstrumentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all instruments', async () => {
      const instruments = [mockInstrument];
      mockInstrumentsService.findAll.mockResolvedValue(instruments);

      const result = await controller.findAll();

      expect(result).toEqual(instruments);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockInstrumentsService.findAll.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow('Service error');
    });
  });

  describe('findOne', () => {
    it('should return an instrument by id', async () => {
      mockInstrumentsService.findOne.mockResolvedValue(mockInstrument);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockInstrument);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockInstrumentsService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(1)).rejects.toThrow('Service error');
    });
  });

  describe('searchInstruments', () => {
    it('should search instruments by query', async () => {
      const instruments = [mockInstrument];
      mockInstrumentsService.searchInstruments.mockResolvedValue(instruments);

      const result = await controller.searchInstruments({ query: 'YPFD', limit: 10, offset: 0 });

      expect(result).toEqual(instruments);
      expect(service.searchInstruments).toHaveBeenCalledWith({
        query: 'YPFD',
        limit: 10,
        offset: 0
      });
    });

    it('should handle pagination correctly', async () => {
      const instruments = [mockInstrument];
      mockInstrumentsService.searchInstruments.mockResolvedValue(instruments);

      const result = await controller.searchInstruments({ query: 'YPFD', limit: 5, offset: 5 });

      expect(result).toEqual(instruments);
      expect(service.searchInstruments).toHaveBeenCalledWith({
        query: 'YPFD',
        limit: 5,
        offset: 5
      });
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockInstrumentsService.searchInstruments.mockRejectedValue(error);

      await expect(controller.searchInstruments({ query: 'YPFD' })).rejects.toThrow('Service error');
    });
  });

  describe('findByTicker', () => {
    it('should return instruments by ticker', async () => {
      const instruments = [mockInstrument];
      mockInstrumentsService.findByTicker.mockResolvedValue(instruments);

      const result = await controller.findByTicker('YPFD');

      expect(result).toEqual(instruments);
      expect(service.findByTicker).toHaveBeenCalledWith('YPFD');
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockInstrumentsService.findByTicker.mockRejectedValue(error);

      await expect(controller.findByTicker('YPFD')).rejects.toThrow('Service error');
    });
  });

  describe('findByName', () => {
    it('should return instruments by name', async () => {
      const instruments = [mockInstrument];
      mockInstrumentsService.findByName.mockResolvedValue(instruments);

      const result = await controller.findByName('Y.P.F.');

      expect(result).toEqual(instruments);
      expect(service.findByName).toHaveBeenCalledWith('Y.P.F.');
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockInstrumentsService.findByName.mockRejectedValue(error);

      await expect(controller.findByName('Y.P.F.')).rejects.toThrow('Service error');
    });
  });

  describe('findByType', () => {
    it('should return instruments by type', async () => {
      const instruments = [mockInstrument];
      mockInstrumentsService.findByType.mockResolvedValue(instruments);

      const result = await controller.findByType('ACCIONES');

      expect(result).toEqual(instruments);
      expect(service.findByType).toHaveBeenCalledWith('ACCIONES');
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockInstrumentsService.findByType.mockRejectedValue(error);

      await expect(controller.findByType('ACCIONES')).rejects.toThrow('Service error');
    });
  });

  describe('getInstrumentWithMarketData', () => {
    it('should return instrument with market data', async () => {
      const instrumentWithMarketData = {
        ...mockInstrument,
        latestMarketData: {
          id: 1,
          date: '2024-01-31',
          close: 1063.25,
          previousClose: 1058.00
        }
      };
      mockInstrumentsService.getInstrumentWithMarketData.mockResolvedValue(instrumentWithMarketData);

      const result = await controller.getInstrumentWithMarketData(1);

      expect(result).toEqual(instrumentWithMarketData);
      expect(service.getInstrumentWithMarketData).toHaveBeenCalledWith(1);
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockInstrumentsService.getInstrumentWithMarketData.mockRejectedValue(error);

      await expect(controller.getInstrumentWithMarketData(1)).rejects.toThrow('Service error');
    });
  });

  describe('getPopularInstruments', () => {
    it('should return popular instruments', async () => {
      const instruments = [mockInstrument];
      mockInstrumentsService.getPopularInstruments.mockResolvedValue(instruments);

      const result = await controller.getPopularInstruments();

      expect(result).toEqual(instruments);
      expect(service.getPopularInstruments).toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockInstrumentsService.getPopularInstruments.mockRejectedValue(error);

      await expect(controller.getPopularInstruments()).rejects.toThrow('Service error');
    });
  });
}); 