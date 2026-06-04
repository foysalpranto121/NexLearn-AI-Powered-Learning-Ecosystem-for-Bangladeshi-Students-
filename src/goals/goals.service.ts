import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GamificationService } from '../gamification/gamification.service';

@Injectable()
export class GoalsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gamificationService: GamificationService,
  ) {}

  async getToday(userId: string, timezone: string) {
    // Convert local "today" to UTC date range
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0]; // simplified; production uses timezone lib

    return this.prisma.dailyGoal.findMany({
      where: { userId, goalDate: new Date(todayStr) },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(
    userId: string,
    data: { title: string; description?: string; goalDate: string; targetMinutes?: number; source?: string },
  ) {
    return this.prisma.dailyGoal.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        goalDate: new Date(data.goalDate),
        targetMinutes: data.targetMinutes,
        source: data.source || 'manual',
      },
    });
  }

  async update(userId: string, id: string, data: Partial<{ title: string; targetMinutes: number; status: string }>) {
    const goal = await this.prisma.dailyGoal.findFirst({ where: { id, userId } });
    if (!goal) throw new NotFoundException('Goal not found');

    return this.prisma.dailyGoal.update({ where: { id }, data });
  }

  async complete(userId: string, id: string) {
    const goal = await this.prisma.dailyGoal.findFirst({ where: { id, userId } });
    if (!goal) throw new NotFoundException('Goal not found');

    const updated = await this.prisma.dailyGoal.update({
      where: { id },
      data: { status: 'completed' },
    });

    // Emit goal.completed learning event
    const event = await this.prisma.learningEvent.create({
      data: {
        userId,
        eventType: 'goal.completed',
        entityType: 'daily_goals',
        entityId: id,
        points: 10,
        metadata: { title: goal.title },
      },
    });

    // Reward XP and evaluate streaks/badges
    await this.gamificationService.rewardEvent(event.id);

    return updated;
  }

  async suggest(userId: string) {
    // In production: queries active roadmap nodes and recent performance to AI-suggest goals
    return [
      { title: 'Study current roadmap node for 30 minutes', targetMinutes: 30, source: 'ai_suggested' },
      { title: 'Complete one coding challenge', targetMinutes: 20, source: 'ai_suggested' },
      { title: 'Review yesterday notes', targetMinutes: 15, source: 'ai_suggested' },
    ];
  }
}
