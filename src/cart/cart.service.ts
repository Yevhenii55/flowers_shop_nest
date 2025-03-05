import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { User } from '../user/user.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  /**
   * Додає продукт в кошик користувача (за email)
   */
  async addProductToCart(email: string, productName: string): Promise<Cart> {
    // Знайти користувача за email
    const user = await this.userRepository.findOne({ where: { email }, relations: ['cart'] });

    if (!user) {
      throw new NotFoundException(`Користувач із email ${email} не знайдений`);
    }

    // Якщо у користувача немає кошика, створюємо новий
    let cart = user.cart;
    if (!cart) {
      cart = this.cartRepository.create({ user, products: [] });
      cart = await this.cartRepository.save(cart);
    }

    // Знайти продукт за назвою
    const foundProduct = await this.productRepository.findOne({ where: { name: productName } });
    if (!foundProduct) {
      throw new NotFoundException(`Продукт ${productName} не знайдений`);
    }

    // Додати продукт до кошика (уникаючи дублікатів)
    if (!cart.products.some(p => p.name === foundProduct.name)) {
      cart.products.push(foundProduct);
    }

    return await this.cartRepository.save(cart);
  }



  /**
   * Отримати кошик користувача за email
   */
  async getCartByEmail(email: string): Promise<Cart> {
    const user = await this.userRepository.findOne({ where: { email }, relations: ['cart', 'cart.products'] });

    if (!user || !user.cart) {
      throw new NotFoundException(`Кошик користувача з email ${email} не знайдений`);
    }

    return user.cart;
  }

  /**
   * Видалити продукт із кошика
   */
  async removeProductFromCart(email: string, productName: string): Promise<Cart> {
    const user = await this.userRepository.findOne({ where: { email }, relations: ['cart', 'cart.products'] });

    if (!user || !user.cart) {
      throw new NotFoundException(`Кошик користувача з email ${email} не знайдений`);
    }

    // Фільтруємо продукти, видаляючи вказаний
    user.cart.products = user.cart.products.filter(product => product.name !== productName);

    return await this.cartRepository.save(user.cart);
  }
}
