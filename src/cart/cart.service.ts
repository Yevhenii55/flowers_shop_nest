import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { User } from '../user/user.entity';
import { Product } from '../products/product.entity';
import { CartProduct } from './cart-product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(CartProduct)
    private readonly cartProductRepository: Repository<CartProduct>,
  ) {
  }

  // Додає продукт в кошик користувача (за email)

  async addProductToCart(email: string, productName: string, quantity: number): Promise<Cart> {
    //  1. Шукаємо користувача разом із кошиком і товарами в ньому
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['cart', 'cart.cartProducts', 'cart.cartProducts.product'],
    });

    if (!user) {
      throw new NotFoundException(`Користувач із email ${email} не знайдений`);
    }

    //  3. Беремо кошик користувача
    const cart = user.cart;

    // 🔹 4. Знаходимо товар за назвою
    const foundProduct = await this.productRepository.findOne({ where: { name: productName } });
    if (!foundProduct) {
      throw new NotFoundException(`Продукт ${productName} не знайдений`);
    }

    // 🔹 5. Переконуємося, що `cart.cartProducts` завжди є масивом
    cart.cartProducts = cart.cartProducts ?? [];

    // 🔹 6. Перевіряємо, чи товар уже є у кошику
    let cartProduct = cart.cartProducts.find(cp => cp.product.id === foundProduct.id);

    if (cartProduct) {
      // 🔹 7. Якщо товар вже є, збільшуємо його кількість
      cartProduct.quantity += quantity;
    } else {
      // 🔹 8. Якщо товару немає, створюємо новий `CartProduct`
      cartProduct = this.cartProductRepository.create({
        cart,
        product: foundProduct,
        quantity,
        price: foundProduct.price, // Фіксуємо ціну на момент додавання
      });

      // 🔹 9. Спочатку зберігаємо новий CartProduct у БД
      cartProduct = await this.cartProductRepository.save(cartProduct);

      // 🔹 10. Додаємо збережений товар у кошик
      cart.cartProducts.push(cartProduct);
    }

    // 🔹 11. Оновлюємо кошик у базі
    await this.cartRepository.save(cart);

    // 🔹 12. Повертаємо оновлений кошик
    const updatedCart = await this.cartRepository.findOne({
      where: { id: cart.id },
      relations: ['cartProducts', 'cartProducts.product'],
    });

    if (!updatedCart) {
      throw new NotFoundException('Кошик не знайдено після оновлення.');
    }

    return updatedCart;
  }



  /**
   * Отримати кошик користувача за email
   */
  async getCartByEmail(email: string): Promise<Cart> {
    // 🔹 1. Шукаємо користувача разом із кошиком і товарами в ньому
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['cart', 'cart.cartProducts', 'cart.cartProducts.product'], // Завантажуємо всі пов'язані дані
    });

    // 🔹 2. Перевіряємо, чи знайдено користувача і чи у нього є кошик
    if (!user || !user.cart) {
      throw new NotFoundException(`Кошик користувача з email ${email} не знайдений`);
    }

    // 🔹 3. Повертаємо об'єкт кошика разом із товарами
    return user.cart;
  }

  /**
   * Видалити продукт із кошика
   */
  async removeProductFromCart(email: string, productName: string): Promise<Cart> {
    // 🔹 1. Шукаємо користувача разом із кошиком і товарами
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['cart', 'cart.cartProducts', 'cart.cartProducts.product'], // Завантажуємо зв’язки
    });

    // 🔹 2. Перевіряємо, чи знайдено користувача і чи у нього є кошик
    if (!user || !user.cart) {
      throw new NotFoundException(`Кошик користувача з email ${email} не знайдений`);
    }

    // 🔹 3. Отримуємо кошик користувача
    const cart = user.cart;

    // 🔹 4. Знаходимо товар у кошику за назвою
    const cartProduct = cart.cartProducts.find(
      (cp) => cp.product.name === productName,
    );

    if (!cartProduct) {
      throw new NotFoundException(`Товар ${productName} не знайдено у кошику`);
    }

    // 🔹 5. Видаляємо товар із бази (проміжну таблицю `CartProduct`)
    await this.cartProductRepository.remove(cartProduct);

    // 🔹 6. Оновлюємо кошик і повертаємо його
    const updatedCart = await this.cartRepository.findOne({
      where: { id: cart.id },
      relations: ['cartProducts', 'cartProducts.product'],
    });

    if (!updatedCart) {
      throw new NotFoundException('Кошик не знайдено після оновлення.');
    }

    return updatedCart;
  }
}
