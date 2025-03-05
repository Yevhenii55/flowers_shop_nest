import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { User } from './user/user.entity';
import { MailService } from './mail/mail.service';
import { Cart } from './cart/cart.entity';
import { Product } from './products/product.entity';
import { Order } from './orders/orders.entity';


@Module({
  imports: [
    AuthModule,
    UserModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [User, Cart, Product, Order],
        synchronize: true,
      }),
    }),
  ],
  exports: [MailService],
  providers: [MailService],
})
//DataSource – це головний об'єкт TypeORM, який управляє підключенням до бази.
export class AppModule {
  constructor(private dataSource: DataSource) {
    if (dataSource.isInitialized) {
      console.log('✅ Database connected successfully!');
    } else {
      console.log('❌ Database connection failed.');
    }
  }
}
