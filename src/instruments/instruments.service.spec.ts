import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { InstrumentsService } from './instruments.service';
import { Instrument } from '../entities/instrument.entity';

describe('InstrumentsService', () => {
  let service: InstrumentsService;
  let repository: Repository<Instrument>;

  const mockInstrument = {
    id: 1,
    ticker: 'YPFD',
    name: 'Y.P.F. S.A.',
    type: 'ACCIONES',
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InstrumentsService,
        {
          provide: getRepositoryToken(Instrument),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<InstrumentsService>(InstrumentsService);
    repository = module.get<Repository<Instrument>>(getRepositoryToken(Instrument));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all instruments', async () => {
      const instruments = [mockInstrument];
      mockRepository.find.mockResolvedValue(instruments);

      const result = await service.findAll();

      expect(result).toEqual(instruments);
      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { ticker: 'ASC' }
      });
    });

    it('should return empty array when no instruments exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { ticker: 'ASC' }
      });
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database error');
      mockRepository.find.mockRejectedValue(error);

      await expect(service.findAll()).rejects.toThrow('Database error');
    });
  });

  describe('findOne', () => {
    it('should return an instrument by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockInstrument);

      const result = await service.findOne(1);

      expect(result).toEqual(mockInstrument);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return null when instrument not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database error');
      mockRepository.findOne.mockRejectedValue(error);

      await expect(service.findOne(1)).rejects.toThrow('Database error');
    });
  });

  describe('findByTicker', () => {
    it('should return instruments by ticker', async () => {
      const instruments = [mockInstrument];
      mockRepository.find.mockResolvedValue(instruments);

      const result = await service.findByTicker('YPFD');

      expect(result).toEqual(instruments);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { ticker: ILike('%YPFD%') },
        order: { ticker: 'ASC' }
      });
    });

    it('should return empty array when no instruments match ticker', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findByTicker('NONEXISTENT');

      expect(result).toEqual([]);
    });
  });

  describe('findByName', () => {
    it('should return instruments by name', async () => {
      const instruments = [mockInstrument];
      mockRepository.find.mockResolvedValue(instruments);

      const result = await service.findByName('Y.P.F.');

      expect(result).toEqual(instruments);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { name: ILike('%Y.P.F.%') },
        order: { name: 'ASC' }
      });
    });
  });

  describe('findByType', () => {
    it('should return instruments by type', async () => {
      const instruments = [mockInstrument];
      mockRepository.find.mockResolvedValue(instruments);

      const result = await service.findByType('ACCIONES');

      expect(result).toEqual(instruments);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { type: ILike('%ACCIONES%') },
        order: { ticker: 'ASC' }
      });
    });
  });

  describe('searchInstruments', () => {
    it('should search instruments by query', async () => {
      const instruments = [mockInstrument];
      mockRepository.find.mockResolvedValue(instruments);

      const result = await service.searchInstruments({ query: 'YPFD' });

      expect(result).toEqual(instruments);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: [
          { ticker: ILike('%YPFD%') },
          { name: ILike('%YPFD%') }
        ],
        order: { ticker: 'ASC' },
        take: 50,
        skip: 0
      });
    });

    it('should search instruments by specific parameters', async () => {
      const instruments = [mockInstrument];
      mockRepository.find.mockResolvedValue(instruments);

      const result = await service.searchInstruments({ 
        ticker: 'YPFD', 
        type: 'ACCIONES',
        limit: 10,
        offset: 5
      });

      expect(result).toEqual(instruments);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {
          ticker: ILike('%YPFD%'),
          type: ILike('%ACCIONES%')
        },
        order: { ticker: 'ASC' },
        take: 10,
        skip: 5
      });
    });

    it('should handle empty search results', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.searchInstruments({ query: 'NONEXISTENT' });

      expect(result).toEqual([]);
    });
  });

  describe('getInstrumentWithMarketData', () => {
    it('should return instrument with market data', async () => {
      const instrumentWithMarketData = {
        ...mockInstrument,
        marketData: [
          {
            id: 1,
            date: '2024-01-31',
            close: 1063.25,
            previousClose: 1058.00
          }
        ]
      };
      mockRepository.findOne.mockResolvedValue(instrumentWithMarketData);

      const result = await service.getInstrumentWithMarketData(1);

      expect(result).toEqual({
        ...mockInstrument,
        latestMarketData: instrumentWithMarketData.marketData[0],
        marketData: undefined
      });
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['marketData']
      });
    });

    it('should return null when instrument not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.getInstrumentWithMarketData(999);

      expect(result).toBeNull();
    });

    it('should handle instrument without market data', async () => {
      const instrumentWithoutMarketData = {
        ...mockInstrument,
        marketData: []
      };
      mockRepository.findOne.mockResolvedValue(instrumentWithoutMarketData);

      const result = await service.getInstrumentWithMarketData(1);

      expect(result).toEqual({
        ...mockInstrument,
        latestMarketData: null,
        marketData: undefined
      });
    });
  });

  describe('getPopularInstruments', () => {
    it('should return popular instruments', async () => {
      const instruments = [mockInstrument];
      mockRepository.find.mockResolvedValue(instruments);

      const result = await service.getPopularInstruments();

      expect(result).toEqual(instruments);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { type: 'ACCIONES' },
        order: { ticker: 'ASC' },
        take: 10
      });
    });
  });
}); 