import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Instrument } from '../entities/instrument.entity';

export interface SearchInstrumentsDto {
  query?: string;
  ticker?: string;
  name?: string;
  type?: string;
  limit?: number;
  offset?: number;
}

@Injectable()
export class InstrumentsService {
  constructor(
    @InjectRepository(Instrument)
    private instrumentsRepository: Repository<Instrument>,
  ) {}

  async findAll(): Promise<Instrument[]> {
    return this.instrumentsRepository.find({
      order: { ticker: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Instrument | null> {
    return this.instrumentsRepository.findOne({ where: { id } });
  }

  async findByTicker(ticker: string): Promise<Instrument[]> {
    return this.instrumentsRepository.find({
      where: { ticker: ILike(`%${ticker}%`) },
      order: { ticker: 'ASC' }
    });
  }

  async findByName(name: string): Promise<Instrument[]> {
    return this.instrumentsRepository.find({
      where: { name: ILike(`%${name}%`) },
      order: { name: 'ASC' }
    });
  }

  async findByType(type: string): Promise<Instrument[]> {
    return this.instrumentsRepository.find({
      where: { type: ILike(`%${type}%`) },
      order: { ticker: 'ASC' }
    });
  }

  async searchInstruments(searchParams: SearchInstrumentsDto): Promise<Instrument[]> {
    const { query, ticker, name, type, limit = 50, offset = 0 } = searchParams;

    let whereConditions: any = {};

    // Si se proporciona query, buscar en ticker y nombre
    if (query) {
      whereConditions = [
        { ticker: ILike(`%${query}%`) },
        { name: ILike(`%${query}%`) }
      ];
    } else {
      // Búsquedas específicas
      if (ticker) {
        whereConditions.ticker = ILike(`%${ticker}%`);
      }
      if (name) {
        whereConditions.name = ILike(`%${name}%`);
      }
      if (type) {
        whereConditions.type = ILike(`%${type}%`);
      }
    }

    return this.instrumentsRepository.find({
      where: whereConditions,
      order: { ticker: 'ASC' },
      take: limit,
      skip: offset
    });
  }

  async getInstrumentWithMarketData(id: number): Promise<any> {
    const instrument = await this.instrumentsRepository.findOne({
      where: { id },
      relations: ['marketData']
    });

    if (!instrument) {
      return null;
    }

    // Obtener el último dato de mercado
    const latestMarketData = instrument.marketData?.length > 0 
      ? instrument.marketData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
      : null;

    return {
      ...instrument,
      latestMarketData,
      marketData: undefined // No incluir todos los datos históricos en la respuesta
    };
  }

  async getPopularInstruments(): Promise<Instrument[]> {
    // Retornar instrumentos populares (por ahora, los primeros 10)
    return this.instrumentsRepository.find({
      where: { type: 'ACCIONES' },
      order: { ticker: 'ASC' },
      take: 10
    });
  }
} 