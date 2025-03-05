import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'Ім’я не може бути порожнім' })
  name: string;

  @IsEmail({}, { message: 'Некоректний формат email' })
  email: string;

  @IsNotEmpty({ message: 'Пароль не може бути пустим' })
  @MinLength(6, { message: 'Пароль має бути не менше 6 символів' })
  password: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'Некоректний формат email' })
  email: string;

  @IsNotEmpty({ message: 'Пароль не може бути пустим' })
  password: string;
}
