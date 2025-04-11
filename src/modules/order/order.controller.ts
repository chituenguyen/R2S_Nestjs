import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
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
  // @UseGuards(JwtAuthGuard)
  async createOrder(@Body() order: Order) {
    return await this.orderService.createOrder(order);
  }

  @Get()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.ADMIN)
  async findAll() {
    return await this.orderService.findAll();
  }

  // this endpoint is used to update the order status
  @Put(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.ADMIN)
  async updateOrder(@Param('id') id: string) {
    return await this.orderService.updateOrder(id);
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string) {
    return await this.orderService.deleteOrder(id);
  }
}
