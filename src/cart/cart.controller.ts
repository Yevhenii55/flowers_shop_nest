import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param
} from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './cart.entity';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /**
   * 📌 Додає товар у кошик користувача
   * @param email - Email користувача
   * @param productName - Назва товару
   * @param quantity - Кількість товару
   */
  @Post('add')
  async addProductToCart(
    @Body() body: { email: string; productName: string; quantity: number }
  ): Promise<Cart> {
    return this.cartService.addProductToCart(body.email, body.productName, body.quantity);
  }

  /**
   * 📌 Отримує кошик користувача за email
   * @param email - Email користувача
   */
  @Get(':email')
  async getCartByEmail(@Param('email') email: string): Promise<Cart> {
    return this.cartService.getCartByEmail(email);
  }

  /**
   * 📌 Видаляє товар із кошика
   * @param email - Email користувача
   * @param productName - Назва товару для видалення
   */
  @Delete('remove')
  async removeProductFromCart(
    @Body() body: { email: string; productName: string }
  ): Promise<Cart> {
    return this.cartService.removeProductFromCart(body.email, body.productName);
  }
}
