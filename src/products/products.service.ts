import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  /**
   * Додає новий продукт у базу даних
   */
  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  /**
   * Отримати всі продукти
   */
  async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  /**
   * Отримати один продукт за ID
   */
  async getProductById(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Продукт з ID ${id} не знайдено`);
    }

    return product;
  }

  /**
   * Видалити продукт за ID
   */
  async deleteProduct(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Продукт з ID ${id} не знайдено`);
    }
  }
}

export class ProductsService {}