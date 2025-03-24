import { Module, OnModuleInit } from '@nestjs/common';
import { OrderItemService } from './orderItem.service';
import { EntityManager } from 'typeorm';
@Module({
  providers: [OrderItemService],
})
export class OrderItemModule implements OnModuleInit {
  constructor(private readonly entityManager: EntityManager) {}

  async onModuleInit() {}
}
