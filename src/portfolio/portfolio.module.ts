import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { User } from '../entities/user.entity';
import { Position } from '../entities/position.entity';
import { MarketData } from '../entities/marketdata.entity';
import { Instrument } from '../entities/instrument.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Position, MarketData, Instrument])
  ],
  controllers: [PortfolioController],
  providers: [PortfolioService],
  exports: [PortfolioService],
})
export class PortfolioModule {} 