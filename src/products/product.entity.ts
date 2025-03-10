import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { CartProduct } from '../cart/cart-product.entity';
import { OrderProduct } from '../orders/order-product.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => CartProduct, cartProduct => cartProduct.product)
  cartProducts: CartProduct[];

  @OneToMany(() => OrderProduct, orderProduct => orderProduct.product)
  orderProducts: OrderProduct[];
}