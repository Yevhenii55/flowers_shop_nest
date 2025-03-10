import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './orders.entity';
import { User } from '../user/user.entity';
import { Cart } from '../cart/cart.entity';
import { Product } from '../products/product.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CartProduct } from '../cart/cart-product.entity';
import { MailService } from '../mail/mail.service';
import { OrderProduct } from './order-product.entity';



@Module({
  imports: [TypeOrmModule.forFeature([Order, User, Cart, CartProduct, Product, OrderProduct])], // 📌 Додаємо необхідні моделі
  controllers: [OrdersController],
  providers: [OrdersService, MailService],
})
export class OrdersModule {}
