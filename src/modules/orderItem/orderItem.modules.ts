import { Module, OnModuleInit } from '@nestjs/common';
import { OrderItemService } from './orderItem.service';
import { EntityManager } from 'typeorm';
@Module({
  providers: [OrderItemService],
})
export class OrderItemModule implements OnModuleInit {
  constructor(private readonly entityManager: EntityManager) {}

  async onModuleInit() {
    await this.entityManager.query(
      'CREATE TABLE IF NOT EXISTS order_items (id SERIAL PRIMARY KEY, order_id INT NOT NULL, product_id INT NOT NULL, quantity INT NOT NULL, price DECIMAL(10, 2) NOT NULL)',
    );
  }
}
