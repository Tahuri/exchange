import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from '../entities/order.entity';
import { User } from '../entities/user.entity';
import { Instrument } from '../entities/instrument.entity';
import { MarketData } from '../entities/marketdata.entity';
import { Position } from '../entities/position.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, User, Instrument, MarketData, Position])
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {} 