import { DataSource } from 'typeorm';
import { User } from './src/entities/user.entity';
import { Instrument } from './src/entities/instrument.entity';
import { Order } from './src/entities/order.entity';
import { MarketData } from './src/entities/marketdata.entity';
import { Position } from './src/entities/position.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'exchange_user',
  password: process.env.DB_PASSWORD || 'exchange_password',
  database: process.env.DB_DATABASE || 'exchange_db',
  entities: [User, Instrument, Order, MarketData, Position],
  migrations: [__dirname + '/src/migrations/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
}); 