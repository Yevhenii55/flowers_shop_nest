import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn
} from 'typeorm';
import { User } from '../user/user.entity';
import { OrderProduct } from './order-product.entity';


@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.orders, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => OrderProduct, orderProduct => orderProduct.order, { cascade: true })
  orderProducts: OrderProduct[];

  @Column({ type: 'enum', enum: ['pending', 'shipped', 'delivered', 'cancelled'], default: 'pending' })
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';

  @CreateDateColumn()
  createdAt: Date;
}
