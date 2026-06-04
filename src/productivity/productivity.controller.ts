import { Controller, Get, Post, Param, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductivityService } from './productivity.service';

@Controller('productivity')
@UseGuards(JwtAuthGuard)
export class ProductivityController {
  constructor(private readonly productivityService: ProductivityService) {}

  @Get('focus/active')
  async getActiveSession(@Req() req: any) {
    const data = await this.productivityService.getActiveSession(req.user.id);
    return { success: true, data };
  }

  @Get('focus/history')
  async getHistory(@Req() req: any) {
    const data = await this.productivityService.getHistory(req.user.id);
    return { success: true, data };
  }

  @Post('focus/start')
  async startSession(
    @Req() req: any,
    @Body() body: { goal_id?: string; roadmap_node_id?: string; planned_minutes?: number; energy_before?: number },
  ) {
    const data = await this.productivityService.startSession(req.user.id, {
      goalId: body.goal_id,
      roadmapNodeId: body.roadmap_node_id,
      plannedMinutes: body.planned_minutes,
      energyBefore: body.energy_before,
    });
    return { success: true, data };
  }

  @Post('focus/:id/end')
  async endSession(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { status: 'completed' | 'abandoned'; energy_after?: number },
  ) {
    const data = await this.productivityService.endSession(req.user.id, id, {
      status: body.status,
      energyAfter: body.energy_after,
    });
    return { success: true, data };
  }
}
