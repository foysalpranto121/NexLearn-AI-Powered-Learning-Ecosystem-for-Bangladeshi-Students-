import { Controller, Post, Get, Patch, Param, Body, Req, UseGuards } from '@nestjs/common';
import { RoadmapService } from './roadmap.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProfileCompletedGuard } from '../profile/profile-completed.guard';

@Controller('roadmaps')
@UseGuards(JwtAuthGuard)
export class RoadmapController {
  constructor(private readonly roadmapService: RoadmapService) {}

  @Post('generate')
  @UseGuards(ProfileCompletedGuard)
  async generate(
    @Req() req: any,
    @Body() body: { target_career: string; current_level: string; timeline_weeks: number },
  ) {
    const data = await this.roadmapService.generateRoadmap(
      req.user.id,
      body.target_career,
      body.current_level,
      body.timeline_weeks,
    );
    return { success: true, data };
  }

  @Get('current')
  async getCurrent(@Req() req: any) {
    const data = await this.roadmapService.getCurrent(req.user.id);
    return { success: true, data };
  }

  @Get(':id')
  async getById(@Req() req: any, @Param('id') id: string) {
    const data = await this.roadmapService.getRoadmapById(req.user.id, id);
    return { success: true, data };
  }

  @Patch(':id/nodes/:nodeId/status')
  async updateNodeStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Param('nodeId') nodeId: string,
    @Body('status') status: string,
  ) {
    const data = await this.roadmapService.updateNodeStatus(req.user.id, id, nodeId, status);
    return { success: true, data };
  }

  @Post(':id/regenerate-node')
  async regenerateNode(
    @Req() req: any,
    @Param('id') id: string,
    @Body('node_id') nodeId: string,
  ) {
    const data = await this.roadmapService.regenerateNode(req.user.id, id, nodeId);
    return { success: true, data };
  }

  @Post(':id/archive')
  async archive(@Req() req: any, @Param('id') id: string) {
    const data = await this.roadmapService.archiveRoadmap(req.user.id, id);
    return { success: true, data };
  }
}
