import { Controller, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
export interface Order {
  userId: number;
  name: string;
  address: string;
  items: {
    productId: number;
    quantity: number;
  }[];
}

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() order: Order) {
    return await this.orderService.createOrder(order);
  }
}
