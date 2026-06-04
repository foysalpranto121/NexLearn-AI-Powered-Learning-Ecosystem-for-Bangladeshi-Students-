import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GamificationService } from '../gamification/gamification.service';

@Injectable()
export class ProductivityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gamificationService: GamificationService,
  ) {}

  async startSession(
    userId: string,
    data: { goalId?: string; roadmapNodeId?: string; plannedMinutes?: number; energyBefore?: number },
  ): Promise<any> {
    // Constraint: Reject if there is already a running focus session
    const runningSession = await this.prisma.focusSession.findFirst({
      where: { userId, status: 'running' },
    });
    if (runningSession) {
      throw new BadRequestException('You already have an active focus session running.');
    }

    return this.prisma.focusSession.create({
      data: {
        userId,
        goalId: data.goalId || null,
        roadmapNodeId: data.roadmapNodeId || null,
        plannedMinutes: data.plannedMinutes || 25,
        energyBefore: data.energyBefore || null,
        status: 'running',
        startedAt: new Date(),
      },
    });
  }

  async endSession(
    userId: string,
    id: string,
    data: { status: 'completed' | 'abandoned'; energyAfter?: number },
  ): Promise<any> {
    const session = await this.prisma.focusSession.findFirst({
      where: { id, userId },
    });
    if (!session) {
      throw new NotFoundException('Focus session not found.');
    }
    if (session.status !== 'running') {
      throw new BadRequestException('This focus session has already ended.');
    }

    const endedAt = new Date();
    const actualMinutes = Math.max(
      1,
      Math.round((endedAt.getTime() - new Date(session.startedAt).getTime()) / (60 * 1000)),
    );

    const updatedSession = await this.prisma.focusSession.update({
      where: { id },
      data: {
        status: data.status,
        endedAt,
        actualMinutes,
        energyAfter: data.energyAfter || null,
      },
    });

    // Create daily metric record update or upsert for study minutes
    const todayStr = new Date().toISOString().split('T')[0];
    try {
      await this.prisma.dailyUserMetric.upsert({
        where: {
          userId_metricDate: {
            userId,
            metricDate: new Date(todayStr),
          },
        },
        update: {
          studyMinutes: { increment: actualMinutes },
        },
        create: {
          userId,
          metricDate: new Date(todayStr),
          studyMinutes: actualMinutes,
        },
      });
    } catch (err) {
      // Ignore metric sync errors in dev
    }

    // Emit focus completed or focus abandoned learning event
    const pointsAwarded = data.status === 'completed' ? 15 : 0;
    const event = await this.prisma.learningEvent.create({
      data: {
        userId,
        eventType: `focus.${data.status}`,
        entityType: 'focus_sessions',
        entityId: id,
        points: pointsAwarded,
        metadata: {
          actualMinutes,
          plannedMinutes: session.plannedMinutes,
        },
      },
    });

    // Process event through gamification engine (streak & XP)
    if (pointsAwarded > 0) {
      await this.gamificationService.rewardEvent(event.id);
    }

    return updatedSession;
  }

  async getActiveSession(userId: string): Promise<any> {
    return this.prisma.focusSession.findFirst({
      where: { userId, status: 'running' },
    });
  }

  async getHistory(userId: string): Promise<any[]> {
    return this.prisma.focusSession.findMany({
      where: { userId },
      orderBy: { startedAt: 'desc' },
      take: 20,
    });
  }
}
