import {
  Controller, Post, Param, Get, ParseIntPipe
} from '@nestjs/common';
import { OrdersService } from './orders.service';



@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService) {
  }

  /**
   * 📌 API для створення замовлення (перенесення товарів з кошика в ордер)
   */
  @Post(':email')
  async createOrder(@Param('email') email: string) {
    return this.ordersService.createOrder(email);
  }

  /**
   * 📌 Отримати замовлення за його ID
   */
  @Get(':orderId')
  async getOrderById(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.ordersService.getOrderById(orderId);
  }
}
