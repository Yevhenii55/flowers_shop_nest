import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateProductDto } from './product.dto';
import { ProductService } from './products.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * Додає новий продукт
   */
  @Post('addProduct')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto);
  }

  /**
   * Отримати всі продукти
   */
  @Get('allProducts')
  async getAllProducts() {
    return this.productService.getAllProducts();
  }

  /**
   * Отримати один продукт за ID
   */
  @Get(':id')
  async getProductById(@Param('id') id: number) {
    return this.productService.getProductById(id);
  }

  /**
   * Видалити продукт за ID
   */
  @Delete(':id')
  async deleteProduct(@Param('id') id: number) {
    return this.productService.deleteProduct(id);
  }
}

export class ProductsController {}