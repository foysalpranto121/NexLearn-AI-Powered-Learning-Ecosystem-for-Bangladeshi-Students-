import { Controller, Get, Post, Param, Body, Req, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { CodingService } from './coding.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('coding')
@UseGuards(JwtAuthGuard)
export class CodingController {
  constructor(private readonly codingService: CodingService) {}

  @Get('challenges')
  async listChallenges(
    @Query('difficulty') difficulty?: string,
    @Query('skill_tag') skillTag?: string,
    @Query('limit') limit?: number,
  ) {
    const data = await this.codingService.listChallenges({ difficulty, skillTag, limit: limit ? Number(limit) : undefined });
    return { success: true, data };
  }

  @Get('challenges/:slug')
  async getChallenge(@Param('slug') slug: string) {
    const data = await this.codingService.getChallengeBySlug(slug);
    return { success: true, data };
  }

  @Post('challenges/:id/run-sample')
  async runSample(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { language: string; source_code: string },
  ) {
    const data = await this.codingService.runSample(req.user.id, id, body.language, body.source_code);
    return { success: true, data };
  }

  @Post('challenges/:id/submit')
  @HttpCode(HttpStatus.ACCEPTED)
  async submit(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: { language: string; source_code: string },
  ) {
    const data = await this.codingService.submit(req.user.id, id, body.language, body.source_code);
    return { success: true, data };
  }

  @Get('submissions/:id')
  async getSubmission(@Req() req: any, @Param('id') id: string) {
    const data = await this.codingService.getSubmission(req.user.id, id);
    return { success: true, data };
  }

  @Post('submissions/:id/feedback')
  async feedback(@Req() req: any, @Param('id') id: string) {
    const data = await this.codingService.generateFeedback(req.user.id, id);
    return { success: true, data };
  }
}
