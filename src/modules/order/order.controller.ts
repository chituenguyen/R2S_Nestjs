import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
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
  @UseGuards(JwtAuthGuard)
  async createOrder(@Body() order: Order) {
    return await this.orderService.createOrder(order);
  }
}
