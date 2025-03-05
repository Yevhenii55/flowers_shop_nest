import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './orders.entity';
import { User } from '../user/user.entity';
import { Cart } from '../cart/cart.entity';
import { Product } from '../products/product.entity';
import { OrderService } from './orders.service';
import { OrderController } from './orders.controller';


@Module({
  imports: [TypeOrmModule.forFeature([Order, User, Cart, Product])], // 📌 Додаємо необхідні моделі
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrdersModule {}
