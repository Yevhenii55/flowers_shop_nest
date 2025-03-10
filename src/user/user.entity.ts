import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn
} from 'typeorm';
import { Cart } from '../cart/cart.entity';
import { Order } from '../orders/orders.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ select: false, nullable: false })
  password: string;

  @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
  role: 'user' | 'admin';

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => Cart, cart => cart.user, { cascade: true })
  @JoinColumn()
  cart: Cart;

  @OneToMany(() => Order, order => order.user, { cascade: true })
  orders: Order[];
}
