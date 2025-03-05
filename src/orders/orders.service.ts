import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './orders.entity';
import { User } from '../user/user.entity';
import { Cart } from '../cart/cart.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  /**
   * Створює новий ордер на основі кошика користувача
   */
  async createOrder(email: string): Promise<Order> {
    // 🔹 1. Знайти користувача за email
    const user = await this.userRepository.findOne({ where: { email }, relations: ['cart', 'cart.products'] });

    if (!user) {
      throw new NotFoundException(`Користувач із email ${email} не знайдений`);
    }

    // 🔹 2. Перевірити, чи є у нього кошик
    if (!user.cart || user.cart.products.length === 0) {
      throw new BadRequestException(`Кошик користувача ${email} порожній`);
    }

    // 🔹 3. Отримати всі продукти з кошика
    const products = user.cart.products;

    // 🔹 4. Створити новий ордер
    const order = this.orderRepository.create({
      user,
      products,
      status: 'pending', // За замовчуванням
    });

    await this.orderRepository.save(order);

    // 🔹 5. Очистити кошик користувача
    user.cart.products = [];
    await this.cartRepository.save(user.cart);

    return order;
  }

  /**
   * Отримати всі замовлення користувача
   */
  async getUserOrders(email: string): Promise<Order[]> {
    const user = await this.userRepository.findOne({ where: { email }, relations: ['orders', 'orders.products'] });

    if (!user) {
      throw new NotFoundException(`Користувач із email ${email} не знайдений`);
    }

    return user.orders;
  }
}
