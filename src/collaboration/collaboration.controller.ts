import { Controller, Get, Post, Patch, Param, Body, Req, UseGuards } from '@nestjs/common';
import { CollaborationService } from './collaboration.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('workspaces')
@UseGuards(JwtAuthGuard)
export class CollaborationController {
  constructor(private readonly collaborationService: CollaborationService) {}

  @Get()
  async list(@Req() req: any) {
    const data = await this.collaborationService.listWorkspaces(req.user.id);
    return { success: true, data };
  }

  @Post()
  async create(@Req() req: any, @Body() body: { name: string; description?: string }) {
    const data = await this.collaborationService.createWorkspace(req.user.id, body.name, body.description);
    return { success: true, data };
  }

  @Post(':id/members')
  async addMember(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { email: string; role?: string },
  ) {
    const data = await this.collaborationService.addMember(req.user.id, id, body.email, body.role || 'member');
    return { success: true, data };
  }

  @Patch(':id/members/:userId')
  async changeMemberRole(
    @Req() req: any,
    @Param('id') id: string,
    @Param('userId') targetUserId: string,
    @Body('role') role: string,
  ) {
    const data = await this.collaborationService.changeMemberRole(req.user.id, id, targetUserId, role);
    return { success: true, data };
  }

  @Post(':id/messages')
  async postMessage(@Req() req: any, @Param('id') id: string, @Body('message') message: string) {
    const data = await this.collaborationService.postMessage(req.user.id, id, message);
    return { success: true, data };
  }
}
