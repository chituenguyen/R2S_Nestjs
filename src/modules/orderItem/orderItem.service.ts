import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class OrderItemService {
  constructor(private readonly entityManager: EntityManager) {}
}
