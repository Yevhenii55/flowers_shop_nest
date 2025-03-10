import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './orders.entity';
import { User } from '../user/user.entity';
import { Cart } from '../cart/cart.entity';
import { CartProduct } from '../cart/cart-product.entity';
import { OrderProduct } from './order-product.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderProduct)
    private readonly orderProductRepository: Repository<OrderProduct>, // Проміжна таблиця для збереження товарів у замовленні

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,

    @InjectRepository(CartProduct)
    private readonly cartProductRepository: Repository<CartProduct>,

    private readonly mailService: MailService, // Сервіс для відправки листів
  ) {}

  /**
   * Створення замовлення на основі кошика користувача
   */
  async createOrder(email: string): Promise<Order> {
    // 1 Отримуємо користувача разом із його кошиком та товарами в ньому
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['cart', 'cart.cartProducts', 'cart.cartProducts.product'], // Завантажуємо всі зв'язки
    });

    if (!user || !user.cart) {
      throw new NotFoundException(`Кошик користувача з email ${email} не знайдено`);
    }

    const cart = user.cart;

    // 2 Перевіряємо, чи кошик не порожній
    if (!cart.cartProducts || cart.cartProducts.length === 0) {
      throw new BadRequestException('Кошик порожній, неможливо створити замовлення');
    }

    // 3 Створюємо нове замовлення без товарів (їх додамо пізніше)
    const order = this.orderRepository.create({
      user,
      orderProducts: [],
      status: 'pending', // Початковий статус замовлення
    });

    const savedOrder = await this.orderRepository.save(order); // Зберігаємо замовлення в базі

    // 4 Створюємо записи в `OrderProduct`, щоб зберегти зв'язок між замовленням та продуктами
    const orderProducts = await Promise.all(
      cart.cartProducts.map(async (cartProduct) => {
        const orderProduct = this.orderProductRepository.create({
          order: savedOrder,
          product: cartProduct.product,
          quantity: cartProduct.quantity,
          price: Number(cartProduct.price)|| 0, // Переконуємося, що ціна коректного типу
        });

        return this.orderProductRepository.save(orderProduct); // Зберігаємо товар у замовленні
      })
    );

    // 5 Оновлюємо запис замовлення, додаючи створені `OrderProduct`
    await this.orderRepository.save({ ...savedOrder, orderProducts });

    // 6 Очищаємо кошик користувача після оформлення замовлення
    await this.cartProductRepository.remove(cart.cartProducts);
    cart.cartProducts = [];
    await this.cartRepository.save(cart);

    // 7 Розраховуємо загальну вартість замовлення
    const totalPrice = orderProducts.reduce((sum, item) => sum + item.quantity * item.price, 0);

    // 8 Відправляємо користувачу підтвердження замовлення на email
    await this.mailService.sendOrderConfirmationEmail(user.email, user.name, orderProducts, totalPrice, order.id);

    // 9 Отримуємо замовлення з усіма його зв'язками перед поверненням результату
    const finalOrder = await this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['user', 'orderProducts', 'orderProducts.product'], // Завантажуємо пов'язані дані
    });

    if (!finalOrder) {
      throw new NotFoundException('Замовлення не знайдено після створення.');
    }

    return finalOrder; // Повертаємо оформлене замовлення
  }
  async getOrderById(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'orderProducts', 'orderProducts.product'],
    });

    if (!order) {
      throw new NotFoundException(`Замовлення з ID ${id} не знайдено`);
    }

    return order;
  }
}
