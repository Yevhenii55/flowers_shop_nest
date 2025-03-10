import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { User } from '../user/user.entity';
import { MailService } from '../mail/mail.service';
import { Cart } from '../cart/cart.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>, // Репозиторій кошика
    private readonly mailService: MailService,
  ) {}

  /**
   * Реєстрація нового користувача
   */
  async register(
    name: string,
    email: string,
    password: string,
    res: Response,
  ): Promise<void> {
    try {
      // 🔹 1. Перевіряємо, чи користувач вже існує
      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) {
        throw new ConflictException('Користувач з таким email вже існує');
      }

      // 🔹 2. Хешуємо пароль
      const hashedPassword = await bcrypt.hash(password, 10);

      // 🔹 3. Створюємо нового користувача
      let user = this.userRepository.create({ name, email, password: hashedPassword });

      // 🔹 4. Зберігаємо користувача у базу
      user = await this.userRepository.save(user);

      // 🔹 5. Створюємо кошик і прив'язуємо до користувача
      const cart = this.cartRepository.create({ user, cartProducts: [] });
      await this.cartRepository.save(cart);

      // 🔹 6. Оновлюємо користувача, додаючи йому кошик
      user.cart = cart;
      await this.userRepository.save(user);

      // 🔹 7. Відправляємо привітальний email
      await this.mailService.sendWelcomeEmail(user.email, user.name);

      // 🔹 8. Повертаємо повідомлення про успішну реєстрацію
      res.status(201).json({ message: 'Реєстрація успішна' });
    } catch (error) {
      console.error('Помилка при реєстрації:', error);
      throw error;
    }
  }

  /**
   * Авторизація користувача (без токена)
   */
  async login(email: string, password: string, res: Response): Promise<void> {
    try {
      // 🔹 1. Шукаємо користувача в базі разом із паролем
      const user = await this.userRepository.findOne({ where: { email }, select: ['password'] });

      // 🔹 2. Перевіряємо чи існує користувач та чи правильний пароль
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException('Невірний email або пароль');
      }

      // 🔹 3. Відправляємо повідомлення про успішну авторизацію
      res.status(200).json({ message: 'Авторизація успішна' });
    } catch (error) {
      console.error('Помилка при авторизації:', error);
      throw error;
    }
  }
}
