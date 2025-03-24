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

  async onModuleInit() {}
}
