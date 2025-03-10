import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column
} from 'typeorm';

import { Product } from '../products/product.entity';
import { Cart } from './cart.entity';

@Entity()
export class CartProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, cart => cart.cartProducts, { onDelete: 'CASCADE' })
  cart: Cart;

  @ManyToOne(() => Product, product => product.cartProducts, { onDelete: 'CASCADE' })
  product: Product;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
}
