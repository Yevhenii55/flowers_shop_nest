import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn
} from 'typeorm';
import { User } from '../user/user.entity';
import { CartProduct } from './cart-product.entity';


@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, user => user.cart, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @OneToMany(() => CartProduct, cartProduct => cartProduct.cart, { cascade: true })
  cartProducts: CartProduct[];

  @CreateDateColumn()
  createdAt: Date;
}
