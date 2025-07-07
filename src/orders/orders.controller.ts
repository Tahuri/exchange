import { Controller, Post, Get, Delete, Body, Param, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { OrdersService, CreateOrderDto } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrder(@Body() orderData: CreateOrderDto) {
    return this.ordersService.createOrder(orderData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async cancelOrder(
    @Param('id', ParseIntPipe) orderId: number,
    @Body('userId', ParseIntPipe) userId: number
  ) {
    return this.ordersService.cancelOrder(orderId, userId);
  }

  @Get('user/:userId')
  async getUserOrders(@Param('userId', ParseIntPipe) userId: number) {
    return this.ordersService.getUserOrders(userId);
  }

  @Get('user/:userId/pending')
  async getUserPendingOrders(@Param('userId', ParseIntPipe) userId: number) {
    return this.ordersService.getUserPendingOrders(userId);
  }

  @Get('positions/:userId')
  async getUserPositions(@Param('userId', ParseIntPipe) userId: number) {
    return this.ordersService.getUserPositions(userId);
  }
} 