import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column
} from 'typeorm';

import { Product } from '../products/product.entity';
import { Order } from './orders.entity';

@Entity()
export class OrderProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, order => order.orderProducts, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => Product, product => product.orderProducts, { onDelete: 'CASCADE' })
  product: Product;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
}
