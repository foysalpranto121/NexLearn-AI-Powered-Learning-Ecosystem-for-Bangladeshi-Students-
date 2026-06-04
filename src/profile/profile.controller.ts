import { Controller, Get, Patch, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('me')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('profile')
  async getProfile(@Req() req: any) {
    const data = await this.profileService.getProfile(req.user.id);
    return { success: true, data };
  }

  @Patch('profile')
  async updateProfile(@Req() req: any, @Body() updateProfileDto: UpdateProfileDto) {
    const data = await this.profileService.updateProfile(req.user.id, updateProfileDto);
    return { success: true, data };
  }

  @Post('skills/assessment')
  async assessSkills(@Req() req: any, @Body() body: { skills: Array<{ skill: string; score: number; source: string }> }) {
    const data = await this.profileService.assessSkills(req.user.id, body.skills);
    return { success: true, data };
  }
}
