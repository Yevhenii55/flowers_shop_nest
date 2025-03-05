import { Controller, Post, Get, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrderService } from './orders.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   * 📌 API: Створити новий ордер з кошика користувача
   * @param email - email користувача, для якого створюється замовлення
   */
  @Post('create')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createOrder(@Body('email') email: string) {
    return this.orderService.createOrder(email);
  }

  /**
   * 📌 API: Отримати всі замовлення користувача
   * @param email - email користувача
   */
  @Get()
  async getUserOrders(@Body('email') email: string) {
    return this.orderService.getUserOrders(email);
  }
}
