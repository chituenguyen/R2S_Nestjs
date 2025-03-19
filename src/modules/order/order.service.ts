import { Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Order } from './order.controller';

@Injectable()
export class OrderService {
  constructor(private readonly entityManager: EntityManager) {}

  public async createOrder(order: Order) {
    try {
      // find products
      const productIds = order.items
        .map((_, index) => `$${index + 1}`)
        .join(',');
      const product: any[] = await this.entityManager.query(
        `SELECT * FROM products WHERE id IN (${productIds})`,
        order.items.map((item) => item.productId),
      );
      // insert order
      const orderResult = await this.entityManager.query(
        'INSERT INTO orders (user_id, name, address, total_amount, status) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [
          order.userId,
          order.name,
          order.address,
          order.items.reduce(
            (acc, item) =>
              acc +
              item.quantity *
                product.find((p) => p.id === item.productId).price,
            0,
          ),
          'pending',
        ],
      );
      const orderId = orderResult[0].id;
      // insert order items
      order.items.forEach(async (item) => {
        await this.entityManager.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
          [
            orderId,
            item.productId,
            item.quantity,
            product.find((p) => p.id === item.productId).price,
          ],
        );
      });
      return {
        status: 'success',
      };
    } catch (error: any) {
      // if has any error, rollback the transaction remove the order and order items
      await this.entityManager.query('ROLLBACK');
      Logger.error(error);
      return {
        status: 'fail',
        message: error.message,
      };
    }
  }

  public async getOrderById(orderId: number) {
    try {
      const order = await this.entityManager.query(
        'SELECT * FROM orders WHERE id = $1',
        [orderId],
      );

      if (!order.length) {
        return { status: 'fail', message: 'Order not found' };
      }

      const items = await this.entityManager.query(
        'SELECT * FROM order_items WHERE order_id = $1',
        [orderId],
      );

      return { status: 'success', order: order[0], items };
    } catch (error: any) {
      Logger.error(error);
      return { status: 'fail', message: error.message };
    }
  }

  public async getAllOrders() {
    try {
      const orders = await this.entityManager.query('SELECT * FROM orders');
      return { status: 'success', orders };
    } catch (error: any) {
      Logger.error(error);
      return { status: 'fail', message: error.message };
    }
  }
}
