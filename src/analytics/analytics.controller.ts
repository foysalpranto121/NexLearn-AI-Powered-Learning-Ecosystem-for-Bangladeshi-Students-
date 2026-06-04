import { Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  async getOverview(@Req() req: any) {
    const data = await this.analyticsService.getOverview(req.user.id);
    return { success: true, data };
  }

  @Get('trends')
  async getTrends(
    @Req() req: any,
    @Query('start_date') startDate: string,
    @Query('end_date') endDate: string,
  ) {
    const data = await this.analyticsService.getTrends(req.user.id, startDate, endDate);
    return { success: true, data };
  }

  @Get('skills')
  async getSkills(@Req() req: any) {
    const data = await this.analyticsService.getSkills(req.user.id);
    return { success: true, data };
  }

  @Post('insights/generate')
  async generateInsights(@Req() req: any) {
    const data = await this.analyticsService.generateInsights(req.user.id);
    return { success: true, data };
  }
}
