import { Controller, Get, Post, Patch, Param, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HackathonService } from './hackathon.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class HackathonController {
  constructor(private readonly hackathonService: HackathonService) {}

  @Get('hackathons')
  async listHackathons() {
    const data = await this.hackathonService.listHackathons();
    return { success: true, data };
  }

  @Post('hackathons/:id/teams')
  async createTeam(
    @Req() req: any,
    @Param('id') hackathonId: string,
    @Body() body: { name: string },
  ) {
    const data = await this.hackathonService.createTeam(req.user.id, hackathonId, body.name);
    return { success: true, data };
  }

  @Post('hackathon-teams/:id/members')
  async inviteMember(
    @Req() req: any,
    @Param('id') teamId: string,
    @Body() body: { email: string },
  ) {
    const data = await this.hackathonService.inviteMember(req.user.id, teamId, body.email);
    return { success: true, data };
  }

  @Patch('hackathon-teams/:id/project')
  async updateProject(
    @Req() req: any,
    @Param('id') teamId: string,
    @Body() body: { projectTitle?: string; repoUrl?: string },
  ) {
    const data = await this.hackathonService.updateProject(req.user.id, teamId, body);
    return { success: true, data };
  }

  @Post('hackathon-teams/:id/submit')
  async submitProject(
    @Req() req: any,
    @Param('id') teamId: string,
    @Body() body: { pitchDeckUrl?: string; demoVideoUrl?: string },
  ) {
    const data = await this.hackathonService.submitProject(req.user.id, teamId, body);
    return { success: true, data };
  }
}
