import { Controller, Post, Get, Delete, Body, Param, Req, UseGuards, Query } from '@nestjs/common';
import { AiTutorService } from './ai-tutor.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProfileCompletedGuard } from '../profile/profile-completed.guard';

@Controller('ai/study/sessions')
@UseGuards(JwtAuthGuard)
export class AiTutorController {
  constructor(private readonly aiTutorService: AiTutorService) {}

  @Post()
  async createSession(
    @Req() req: any,
    @Body() body: { title?: string; subject?: string; mode?: string },
  ) {
    const data = await this.aiTutorService.createSession(req.user.id, body.title, body.subject, body.mode);
    return { success: true, data };
  }

  @Get()
  async getSessions(@Req() req: any, @Query('limit') limit?: number) {
    const data = await this.aiTutorService.getSessions(req.user.id, limit ? Number(limit) : undefined);
    return { success: true, data };
  }

  @Get(':id')
  async getSessionById(@Req() req: any, @Param('id') id: string) {
    const data = await this.aiTutorService.getSessionById(req.user.id, id);
    return { success: true, data };
  }

  @Post(':id/messages')
  @UseGuards(ProfileCompletedGuard)
  async postMessage(
    @Req() req: any,
    @Param('id') id: string,
    @Body('message') message: string,
  ) {
    const data = await this.aiTutorService.postMessage(req.user.id, id, message);
    return { success: true, data };
  }

  @Delete(':id')
  async deleteSession(@Req() req: any, @Param('id') id: string) {
    const data = await this.aiTutorService.deleteSession(req.user.id, id);
    return { success: true, data };
  }
}
