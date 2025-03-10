import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { MailService } from '../mail/mail.service';
import { Cart } from '../cart/cart.entity';
import { Product } from '../products/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Cart, Product])],
  controllers: [AuthController],
  providers: [AuthService, MailService],
})
export class AuthModule {}
