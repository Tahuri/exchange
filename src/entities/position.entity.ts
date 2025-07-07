import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Instrument } from './instrument.entity';

@Entity('positions')
export class Position {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  userId: number;

  @Column({ type: 'int', nullable: true })
  instrumentId: number;

  @Column({ type: 'double precision', default: 0 })
  quantity: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  averagePrice: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  marketValue: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  dailyReturn: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  totalReturn: number;

  @ManyToOne(() => User, user => user.positions)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Instrument, instrument => instrument.positions)
  @JoinColumn({ name: 'instrumentId' })
  instrument: Instrument;
} 