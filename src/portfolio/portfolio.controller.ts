import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get(':userId')
  async getUserPortfolio(@Param('userId', ParseIntPipe) userId: number) {
    return this.portfolioService.getUserPortfolio(userId);
  }

  @Get(':userId/summary')
  async getUserPortfolioSummary(@Param('userId', ParseIntPipe) userId: number) {
    return this.portfolioService.getUserPortfolioSummary(userId);
  }

  @Get(':userId/position/:instrumentId')
  async getPositionDetails(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('instrumentId', ParseIntPipe) instrumentId: number
  ) {
    return this.portfolioService.getPositionDetails(userId, instrumentId);
  }
} 