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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
  ) {
  }

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
      // Перевіряємо, чи існує користувач
      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) {
        throw new ConflictException('Користувач з таким email вже існує');
      }

      // Хешуємо пароль
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = this.userRepository.create({ name, email, password: hashedPassword });

      // Зберігаємо користувача
      await this.userRepository.save(user);

      // Відправляємо привітальний email
      await this.mailService.sendWelcomeEmail(user.email, user.name);

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
      // Пошук користувача в базі
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException('Невірний email або пароль');
      }

      // Зберігаємо дані користувача в сесії (або передаємо у відповідь)
      res.status(200).json({ message: 'Авторизація успішна' });
    } catch (error) {
      console.error('Помилка при авторизації:', error);
      throw error;
    }
  }
}