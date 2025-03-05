import { Controller, Post, Body, UsePipes, ValidationPipe, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './auth.dto';
import { Response } from 'express';

/**
 * Контролер для обробки запитів на аутентифікацію.
 * Відповідає за реєстрацію та авторизацію користувачів.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Реєстрація нового користувача.
   *
   * @param registerDto - DTO (Data Transfer Object), що містить email і пароль нового користувача.
   * @returns Об'єкт із повідомленням про успішну реєстрацію.
   */
  @Post('register')
  @UsePipes(new ValidationPipe({
    whitelist: true, // Видаляє зайві поля, які не описані в DTO
    forbidNonWhitelisted: true, // Викидає помилку, якщо є невідомі поля
    transform: true, // Автоматично перетворює типи (наприклад, рядки в числа, якщо треба)
  }))
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    await this.authService.register(registerDto.name ,registerDto.email, registerDto.password, res);
  }

  /**
   * Вхід користувача в систему.
   *
   * @param loginDto - DTO, що містить email та пароль користувача.
   * @returns Об'єкт із повідомленням про успішний вхід.
   */
  @Post('login')
  @UsePipes(new ValidationPipe({
    whitelist: true, // Видаляє непотрібні поля з запиту
    forbidNonWhitelisted: true, // Якщо передані зайві поля — повертає помилку
    transform: true, // Автоматично перетворює типи значень відповідно до DTO
  }))
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    await this.authService.login(loginDto.email, loginDto.password, res);
  }
}
