import { Module, OnModuleInit } from '@nestjs/common';
import { OrderService } from './order.service';
import { EntityManager } from 'typeorm';
import { OrderController } from './order.controller';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule implements OnModuleInit {
  constructor(private readonly entityManager: EntityManager) {}

  async onModuleInit() {
    // await this.entityManager.query(
    //   'CREATE TABLE IF NOT EXISTS orders (id SERIAL PRIMARY KEY, user_id INT NOT NULL, name VARCHAR(255) NOT NULL, address VARCHAR(255) NOT NULL, total_amount DECIMAL(10, 2) NOT NULL, status VARCHAR(255) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)',
    // );
  }
}
