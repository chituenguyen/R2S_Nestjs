import { Injectable, NotFoundException } from '@nestjs/common';
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

  public async deleteProduct(id: string) {
    const result = await this.entityManager.query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [id],
    );

    if (!result[0]) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return {
      message: 'Product deleted successfully',
      deletedProduct: result[0],
    };
  }

  public async resetProductTable() {
    await this.entityManager.query('DELETE FROM products'); // Delete all products
    await this.entityManager.query(
      'ALTER SEQUENCE products_id_seq RESTART WITH 1',
    ); // Reset ID sequence

    return { message: 'Product table reset successfully' };
  }
}
