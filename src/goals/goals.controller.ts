import { Controller, Get, Post, Patch, Param, Body, Req, Query, UseGuards } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('goals')
@UseGuards(JwtAuthGuard)
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get('today')
  async getToday(@Req() req: any, @Query('timezone') tz?: string) {
    const data = await this.goalsService.getToday(req.user.id, tz || 'UTC');
    return { success: true, data };
  }

  @Post()
  async create(@Req() req: any, @Body() body: any) {
    const data = await this.goalsService.create(req.user.id, body);
    return { success: true, data };
  }

  @Patch(':id')
  async update(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    const data = await this.goalsService.update(req.user.id, id, body);
    return { success: true, data };
  }

  @Post(':id/complete')
  async complete(@Req() req: any, @Param('id') id: string) {
    const data = await this.goalsService.complete(req.user.id, id);
    return { success: true, data };
  }

  @Post('suggest')
  async suggest(@Req() req: any) {
    const data = await this.goalsService.suggest(req.user.id);
    return { success: true, data };
  }
}
