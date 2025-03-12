import { Module, OnModuleInit } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule implements OnModuleInit {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  async onModuleInit() {
    await this.entityManager.query(
      'CREATE TABLE IF NOT EXISTS products (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, price DECIMAL(10, 2) NOT NULL, description TEXT NOT NULL, image TEXT NOT NULL, category VARCHAR(255) NOT NULL, brand VARCHAR(255) NOT NULL, stock INT NOT NULL DEFAULT 0, is_active BOOLEAN NOT NULL DEFAULT true)',
    );
  }
}
