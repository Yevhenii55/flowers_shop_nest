import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /**
   * Додає продукт в кошик за email користувача
   */
  @Post('add')
  async addProductToCart(@Body() body: { email: string; productName: string }) {
    return this.cartService.addProductToCart(body.email, body.productName);
  }

  /**
   * Отримати кошик користувача за email
   */
  @Get(':email')
  async getCartByEmail(@Param('email') email: string) {
    return this.cartService.getCartByEmail(email);
  }

  /**
   * Видалити продукт з кошика
   */
  @Delete('remove')
  async removeProductFromCart(@Body() body: { email: string; productName: string }) {
    return this.cartService.removeProductFromCart(body.email, body.productName);
  }
}
