import { Injectable, CanActivate, ExecutionContext, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileCompletedGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      return false;
    }

    const profile = await this.prisma.userProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      throw new ConflictException({
        statusCode: 409,
        error: 'PROFILE_INCOMPLETE',
        message: 'Onboarding profile must be completed first.',
        details: ['target_career', 'current_level', 'weekly_hours', 'learning_style'],
      });
    }

    const missingFields: string[] = [];
    if (!profile.targetCareer) missingFields.push('target_career');
    if (!profile.currentLevel) missingFields.push('current_level');
    if (!profile.weeklyHours) missingFields.push('weekly_hours');
    if (!profile.learningStyle) missingFields.push('learning_style');

    if (missingFields.length > 0) {
      throw new ConflictException({
        statusCode: 409,
        error: 'PROFILE_INCOMPLETE',
        message: 'Onboarding profile must be completed first.',
        details: missingFields,
      });
    }

    return true;
  }
}
