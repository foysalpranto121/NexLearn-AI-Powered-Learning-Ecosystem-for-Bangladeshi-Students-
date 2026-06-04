import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const profile = await this.prisma.userProfile.upsert({
      where: { userId },
      update: updateProfileDto,
      create: {
        userId,
        targetCareer: updateProfileDto.targetCareer || '',
        currentLevel: updateProfileDto.currentLevel || 'beginner',
        weeklyHours: updateProfileDto.weeklyHours || 10,
        preferredLanguage: updateProfileDto.preferredLanguage || 'en',
        learningStyle: updateProfileDto.learningStyle || 'mixed',
        timezone: updateProfileDto.timezone || 'UTC',
      },
    });

    return profile;
  }

  async assessSkills(userId: string, skills: Array<{ skill: string; score: number; source: string }>) {
    // Save assessment results as learning events or user skills records
    const event = await this.prisma.learningEvent.create({
      data: {
        userId,
        eventType: 'profile.skills.assessment',
        entityType: 'user_profiles',
        entityId: userId,
        points: 0,
        metadata: { skills },
      },
    });

    return { eventId: event.id, status: 'saved' };
  }
}
