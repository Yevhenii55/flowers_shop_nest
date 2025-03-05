import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Додаємо TypeORM
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // Експортуємо, щоб інші модулі могли використовувати
})
export class UserModule {}
