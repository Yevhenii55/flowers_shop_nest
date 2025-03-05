import {
  Entity,                // Декоратор позначає, що клас є сутністю бази даних
  PrimaryGeneratedColumn, // Оголошуємо автоматично згенерований первинний ключ
  Column,                // Використовується для визначення звичайних колонок у БД
  CreateDateColumn,      // Автоматично встановлює дату створення запису
  UpdateDateColumn,      // Автоматично оновлює дату при кожній зміні запису
  OneToMany,             // Визначає зв’язок "Один до багатьох" (User → Orders)
  OneToOne,              // Визначає зв’язок "Один до одного" (User → Cart)
  JoinColumn,            // Вказує, що цей клас містить зовнішній ключ
} from 'typeorm';        // Імпортуємо необхідні декоратори з TypeORM

// Імпортуємо інші сутності, які будуть пов'язані з User
import { Cart } from '../cart/cart.entity';
import { Order } from '../orders/orders.entity';

// Позначаємо цей клас як сутність бази даних
@Entity()
export class User {

  // 🔹 Первинний ключ (id), який буде автоматично згенерований для кожного користувача
  @PrimaryGeneratedColumn()
  id: number;

  // 🔹 Колонка "name" - унікальне та обов’язкове поле (не може бути NULL)
  @Column({ unique: true, nullable: false })
  name: string;

  // 🔹 Колонка "email" - також унікальне та обов’язкове поле
  @Column({ unique: true, nullable: false })
  email: string;

  //  Колонка "password" - прихована при find(), бо select: false
  //    Це зроблено з міркувань безпеки, щоб пароль не видавався у звичайних запитах.
  @Column({ select: false, nullable: false })
  password: string;

  //  Колонка "role" - визначає, чи це звичайний користувач чи адміністратор
  //    Використовуємо enum (перелічуваний тип), де можливі значення 'user' або 'admin'.
  //    Значення за замовчуванням: 'user'.
  @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
  role: 'user' | 'admin';

  //  Колонка "createdAt" - дата створення запису
  //    Значення встановлюється автоматично при першому збереженні.
  @CreateDateColumn()
  createdAt: Date;

  //  Колонка "updatedAt" - дата останнього оновлення запису
  //    Значення оновлюється автоматично при зміні будь-якого поля у користувача.
  @UpdateDateColumn()
  updatedAt: Date;

  //  Зв’язок "Один до одного" між User та Cart
  //    Це означає, що у кожного користувача може бути лише один кошик (Cart).
  //    { cascade: true } дозволяє автоматично створювати кошик разом із користувачем.
  //    { onDelete: 'CASCADE' } дозволяє автоматично видаляти кошик, якщо користувач видаляється.
  @OneToOne(() => Cart, cart => cart.user, { cascade: true })
  @JoinColumn() // 🔹 Вказує, що User містить зовнішній ключ (cardId) у таблиці user
  cart: Cart;

  // 🔹 Зв’язок "Один до багатьох" між User та Order
  //    Це означає, що **один користувач може мати багато замовлень (Order)**.
  //    { cascade: true } - дозволяє автоматично створювати/видаляти замовлення разом із користувачем.
  @OneToMany(() => Order, order => order.user, { cascade: true })
  orders: Order[];
}