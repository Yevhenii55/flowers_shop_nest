import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    }) as nodemailer.Transporter;
  }

  async sendWelcomeEmail(to: string, userName: string) {
    try {
      await this.transporter.sendMail({
        from: `"Flower Shop" <${this.configService.get<string>('EMAIL_USER')}>`,
        to,
        subject: `🌸 Вітаємо, ${userName}, у Flower Shop! 🌸`,
        text: `Привіт, ${userName}!\n\nРеєстрація пройшла успішно. Дякуємо, що обрали нас!\n\nПерегляньте наш каталог: https://flowershop.com`,
        html: `
        <div style="max-width: 600px; margin: auto; background: #fff0f6; border-radius: 10px; 
                    padding: 20px; text-align: center; font-family: 'Arial', sans-serif;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">

          <!-- Привітання -->
          <h1 style="color: #d63384; font-size: 24px;">🌸 Вітаємо, ${userName}! 🌸</h1>
          <p style="font-size: 16px; color: #555;">Реєстрація пройшла успішно! Ми раді бачити вас у нашому магазині.</p>
          
          <!-- Кнопка -->
          <a href="https://flowershop.com" 
             style="display: inline-block; padding: 12px 24px; margin-top: 10px; 
                    background: linear-gradient(to right, #ff6699, #ff3366);
                    color: #fff; text-decoration: none; font-size: 18px; border-radius: 5px;
                    font-weight: bold; transition: 0.3s;">
            🛍 Перейти до магазину
          </a>

          <hr style="border: none; border-top: 1px solid #ff6699; margin: 20px 0;">

          <!-- Контакти -->
          <p style="font-size: 14px; color: #777;">
            📍 <strong>Адреса:</strong> вул. Квіткова, 15, Черкаси <br>
            📞 <strong>Телефон:</strong> +380 93 096 3829 <br>
            📧 <strong>Email:</strong> support@flowershop.com <br>
            <a href="https://facebook.com/flowershop" style="color: #d63384;">Facebook</a> | 
            <a href="https://instagram.com/flowershop" style="color: #d63384;">Instagram</a>
          </p>

          <!-- Підпис -->
          <p style="font-size: 12px; color: #aaa;">Дякуємо, що обрали нас! 💖</p>
        </div>`,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Помилка надсилання email:', error.message);
      } else {
        console.error('Невідома помилка надсилання email');
      }
    }
  }


}
