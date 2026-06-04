import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../shared/redis.service';
import { AiOrchestratorService } from '../shared/ai-orchestrator/ai-orchestrator.service';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly aiOrchestrator: AiOrchestratorService,
  ) {}

  async getOverview(userId: string): Promise<any> {
    const cacheKey = `user:${userId}:analytics:overview`;
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // 1. Total study minutes (Sum from FocusSession + DailyUserMetric)
    const focusAgg = await this.prisma.focusSession.aggregate({
      where: { userId, status: 'completed' },
      _sum: { actualMinutes: true },
    });
    const metricsAgg = await this.prisma.dailyUserMetric.aggregate({
      where: { userId },
      _sum: { studyMinutes: true },
    });
    const total_study_minutes = (focusAgg._sum.actualMinutes || 0) + (metricsAgg._sum.studyMinutes || 0);

    // 2. Roadmap progress percentage
    const roadmap = await this.prisma.roadmaps.findFirst({
      where: { userId, status: 'active' },
      include: { nodes: true },
    });
    let roadmap_progress_percentage = 0;
    if (roadmap && roadmap.nodes.length > 0) {
      const completed = roadmap.nodes.filter((n) => n.status === 'completed').length;
      roadmap_progress_percentage = Math.round((completed / roadmap.nodes.length) * 1000) / 10;
    }

    // 3. Streak days
    const streak = await this.prisma.streak.findUnique({ where: { userId } });
    const streak_days = streak ? streak.currentStreak : 0;

    // 4. XP
    const xpAgg = await this.prisma.xpEvent.aggregate({
      where: { userId },
      _sum: { points: true },
    });
    const xp = xpAgg._sum.points || 0;

    // 5. Coding accuracy percentage
    const totalSubs = await this.prisma.codeSubmission.count({ where: { userId } });
    const acceptedSubs = await this.prisma.codeSubmission.count({ where: { userId, status: 'accepted' } });
    const coding_accuracy_percentage = totalSubs > 0 ? Math.round((acceptedSubs / totalSubs) * 1000) / 10 : 0;

    const data = {
      total_study_minutes: total_study_minutes || 0,
      roadmap_progress_percentage: roadmap_progress_percentage || 0.0,
      streak_days: streak_days || 0,
      xp: xp || 0,
      coding_accuracy_percentage: coding_accuracy_percentage || 0.0,
    };

    // Cache in Redis for 10 minutes (600 seconds)
    await this.redis.set(cacheKey, JSON.stringify(data), 600);
    return data;
  }

  async getTrends(userId: string, startDateStr: string, endDateStr: string): Promise<any> {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    return this.prisma.dailyUserMetric.findMany({
      where: {
        userId,
        metricDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { metricDate: 'asc' },
    });
  }

  async getSkills(userId: string): Promise<any> {
    const cacheKey = `user:${userId}:analytics:skills`;
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const submissions = await this.prisma.codeSubmission.findMany({
      where: { userId },
      include: { challenge: true },
    });

    const tagStats = new Map<string, { total: number; accepted: number }>();
    for (const sub of submissions) {
      const tag = sub.challenge.skillTag;
      if (!tagStats.has(tag)) {
        tagStats.set(tag, { total: 0, accepted: 0 });
      }
      const stats = tagStats.get(tag)!;
      stats.total++;
      if (sub.status === 'accepted') {
        stats.accepted++;
      }
    }

    const strengths: string[] = [];
    const weaknesses: string[] = [];

    for (const [tag, stats] of tagStats.entries()) {
      const accuracy = stats.accepted / stats.total;
      if (accuracy < 0.6) {
        weaknesses.push(tag);
      } else {
        strengths.push(tag);
      }
    }

    // Default values if user is onboarding or has no submissions yet
    if (strengths.length === 0 && weaknesses.length === 0) {
      strengths.push('HTML', 'JavaScript');
      weaknesses.push('CSS');
    }

    const data = { strengths, weaknesses };
    await this.redis.set(cacheKey, JSON.stringify(data), 600);
    return data;
  }

  async generateInsights(userId: string): Promise<any> {
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const metrics = await this.prisma.dailyUserMetric.findMany({
      where: { userId, metricDate: { gte: fourteenDaysAgo } },
      orderBy: { metricDate: 'desc' },
    });

    const events = await this.prisma.learningEvent.findMany({
      where: { userId, occurredAt: { gte: fourteenDaysAgo } },
      orderBy: { occurredAt: 'desc' },
      take: 50,
    });

    return this.aiOrchestrator.generateAnalyticsInsights(userId, { metrics, events });
  }

  async clearUserCache(userId: string): Promise<void> {
    this.logger.log(`Invalidating cache for user: ${userId}`);
    await this.redis.delPattern(`user:${userId}:analytics:*`);
  }
}
