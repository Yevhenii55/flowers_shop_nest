import { Module } from '@nestjs/common';
import { Product } from './product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './products.controller';
import { ProductService } from './products.service';
import { Cart } from '../cart/cart.entity';
import { Order } from '../orders/orders.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Cart, Order, ])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductsModule {}
