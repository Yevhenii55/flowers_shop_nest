import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Product } from '../products/product.entity';
import { User } from '../user/user.entity';
import { CartProduct } from './cart-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, Product, User, CartProduct])], // Імпортуємо сутності, які будемо використовувати
  controllers: [CartController], // Додаємо контролер кошика
  providers: [CartService], // Додаємо сервіс кошика
  exports: [CartService], // Дозволяємо використовувати CartService в інших модулях
})
export class CartModule {}
