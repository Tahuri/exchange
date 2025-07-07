import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Instrument } from './instrument.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  instrumentId: number;

  @Column({ type: 'int', nullable: true })
  userId: number;

  @Column({ type: 'int', nullable: true })
  size: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  type: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  side: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  datetime: Date;

  @ManyToOne(() => User, user => user.orders)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Instrument, instrument => instrument.orders)
  @JoinColumn({ name: 'instrumentId' })
  instrument: Instrument;
} 