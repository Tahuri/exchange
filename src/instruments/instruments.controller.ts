import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { InstrumentsService, SearchInstrumentsDto } from './instruments.service';

@Controller('instruments')
export class InstrumentsController {
  constructor(private readonly instrumentsService: InstrumentsService) {}

  @Get()
  async findAll() {
    return this.instrumentsService.findAll();
  }

  @Get('search')
  async searchInstruments(@Query() searchParams: SearchInstrumentsDto) {
    return this.instrumentsService.searchInstruments(searchParams);
  }

  @Get('ticker/:ticker')
  async findByTicker(@Param('ticker') ticker: string) {
    return this.instrumentsService.findByTicker(ticker);
  }

  @Get('name/:name')
  async findByName(@Param('name') name: string) {
    return this.instrumentsService.findByName(name);
  }

  @Get('type/:type')
  async findByType(@Param('type') type: string) {
    return this.instrumentsService.findByType(type);
  }

  @Get('popular')
  async getPopularInstruments() {
    return this.instrumentsService.getPopularInstruments();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.instrumentsService.findOne(id);
  }

  @Get(':id/market-data')
  async getInstrumentWithMarketData(@Param('id', ParseIntPipe) id: number) {
    return this.instrumentsService.getInstrumentWithMarketData(id);
  }
} 