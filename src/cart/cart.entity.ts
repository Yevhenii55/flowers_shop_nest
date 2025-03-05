import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn, JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Product } from '../products/product.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, user => user.cart, { onDelete: 'CASCADE' })
  @JoinColumn() //  Вказує, що Cart містить зовнішній ключ (userId) у таблиці cart
  user: User;

  @ManyToMany(() => Product, { eager: true })
  @JoinTable()
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;
}