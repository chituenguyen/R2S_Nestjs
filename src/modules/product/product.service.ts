import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  public async findAll() {
    const data = await this.entityManager.query('SELECT * FROM products');
    return { data: data };
  }

  public async findOne(id: string) {
    const data = await this.entityManager.query(
      'SELECT * FROM products WHERE id = $1',
      [id],
    );
    return { data: data };
  }
}
