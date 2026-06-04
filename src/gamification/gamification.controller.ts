import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GamificationService } from './gamification.service';

@Controller('gamification')
@UseGuards(JwtAuthGuard)
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Get('streak')
  async getStreak(@Req() req: any) {
    const data = await this.gamificationService.getStreak(req.user.id);
    return { success: true, data };
  }

  @Get('badges')
  async getBadges(@Req() req: any) {
    const data = await this.gamificationService.getBadges(req.user.id);
    return { success: true, data };
  }

  @Get('leaderboard')
  async getLeaderboard() {
    const data = await this.gamificationService.getLeaderboard();
    return { success: true, data };
  }
}
