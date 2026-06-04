import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsService } from '../analytics/analytics.service';

@Injectable()
export class GamificationService {
  private readonly logger = new Logger(GamificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  /**
   * Processes a learning event to award XP and evaluate streaks/badges.
   */
  async rewardEvent(eventId: string): Promise<any> {
    const event = await this.prisma.learningEvent.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      this.logger.warn(`Learning event ${eventId} not found.`);
      return null;
    }

    // Prevent double XP awards for the same event
    const existingXp = await this.prisma.xpEvent.findUnique({
      where: { sourceEventId: eventId },
    });
    if (existingXp) {
      return existingXp;
    }

    let xpPoints = event.points || 10;
    let reason = `Activity completed: ${event.eventType}`;

    // Apply XP Reward Mapping from Spec
    if (event.eventType === 'goal.completed') {
      const completedGoalsCount = await this.prisma.learningEvent.count({
        where: { userId: event.userId, eventType: 'goal.completed' },
      });
      if (completedGoalsCount === 1) {
        xpPoints = 20; // FIRST_GOAL completed
        reason = 'First goal completed bonus!';
      }
    } else if (event.eventType === 'submission.accepted') {
      const acceptedCount = await this.prisma.learningEvent.count({
        where: { userId: event.userId, eventType: 'submission.accepted' },
      });
      if (acceptedCount === 1) {
        xpPoints = 40; // FIRST_CODE_ACCEPT
        reason = 'First coding challenge accepted bonus!';
      }
    } else if (event.eventType === 'roadmap.node.completed') {
      xpPoints = 25; // ROADMAP_NODE_DONE
      reason = 'Roadmap node completed!';
    } else if (event.eventType === 'notes.summary.completed') {
      xpPoints = 15; // NOTES_SUMMARY_DONE
      reason = 'Study notes summarized!';
    } else if (event.eventType === 'team.qa.accepted') {
      xpPoints = 30; // HELPFUL_TEAMMATE
      reason = 'Q&A answer accepted by teammate!';
    }

    // Insert XP event
    const xpEvent = await this.prisma.xpEvent.create({
      data: {
        userId: event.userId,
        sourceEventId: eventId,
        points: xpPoints,
        reason,
      },
    });

    // Update daily metric XP
    const todayStr = new Date().toISOString().split('T')[0];
    try {
      await this.prisma.dailyUserMetric.upsert({
        where: {
          userId_metricDate: {
            userId: event.userId,
            metricDate: new Date(todayStr),
          },
        },
        update: {
          xpEarned: { increment: xpPoints },
        },
        create: {
          userId: event.userId,
          metricDate: new Date(todayStr),
          xpEarned: xpPoints,
        },
      });
    } catch (err) {
      this.logger.warn(`Failed to update daily user metric XP: ${err.message}`);
    }

    // Process Streaks if applicable
    if (event.eventType === 'goal.completed' || event.eventType === 'focus.completed') {
      await this.updateStreak(event.userId, todayStr);
    }

    // Evaluate badges
    await this.evaluateBadges(event.userId);

    // Invalidate analytics cache
    await this.analyticsService.clearUserCache(event.userId);

    return xpEvent;
  }

  /**
   * Updates user streak based on activity date in target local timezone.
   */
  async updateStreak(userId: string, localDateStr: string): Promise<void> {
    const localDate = new Date(localDateStr);
    localDate.setUTCHours(0, 0, 0, 0);

    const streak = await this.prisma.streak.findUnique({ where: { userId } });

    if (!streak) {
      await this.prisma.streak.create({
        data: {
          userId,
          currentStreak: 1,
          longestStreak: 1,
          lastActivityDate: localDate,
        },
      });
      return;
    }

    const lastActivity = new Date(streak.lastActivityDate);
    lastActivity.setUTCHours(0, 0, 0, 0);

    const diffTime = localDate.getTime() - lastActivity.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      const nextStreak = streak.currentStreak + 1;
      await this.prisma.streak.update({
        where: { userId },
        data: {
          currentStreak: nextStreak,
          longestStreak: Math.max(nextStreak, streak.longestStreak),
          lastActivityDate: localDate,
        },
      });

      // Bonus for 3-day streak
      if (nextStreak === 3) {
        // Find if we have a learning event for streak.3day today
        const event = await this.prisma.learningEvent.create({
          data: {
            userId,
            eventType: 'streak.3day',
            points: 50, // THREE_DAY_STREAK
            metadata: { streakCount: 3 },
          },
        });
        await this.rewardEvent(event.id);
      }
    } else if (diffDays > 1) {
      await this.prisma.streak.update({
        where: { userId },
        data: { currentStreak: 1, lastActivityDate: localDate },
      });
    }
  }

  /**
   * Helper to ensure basic badges exist in the DB, then checks and awards them.
   */
  private async evaluateBadges(userId: string): Promise<void> {
    const defaultBadges = [
      { code: 'FIRST_GOAL', name: 'Goal Starter', description: 'Completed your first daily learning goal!' },
      { code: 'THREE_DAY_STREAK', name: 'Consistent Learner', description: 'Maintained a 3-day learning streak!' },
      { code: 'FIRST_CODE_ACCEPT', name: 'Code Warrior', description: 'Successfully solved your first coding challenge!' },
    ];

    // Ensure badges exist
    for (const dbadge of defaultBadges) {
      await this.prisma.badge.upsert({
        where: { code: dbadge.code },
        update: {},
        create: {
          code: dbadge.code,
          name: dbadge.name,
          description: dbadge.description,
        },
      });
    }

    // Check FIRST_GOAL
    const firstGoalEarned = await this.prisma.userBadge.findFirst({
      where: { userId, badge: { code: 'FIRST_GOAL' } },
    });
    if (!firstGoalEarned) {
      const goalsCompleted = await this.prisma.learningEvent.findFirst({
        where: { userId, eventType: 'goal.completed' },
      });
      if (goalsCompleted) {
        await this.awardBadge(userId, 'FIRST_GOAL', goalsCompleted.id);
      }
    }

    // Check THREE_DAY_STREAK
    const streakBadgeEarned = await this.prisma.userBadge.findFirst({
      where: { userId, badge: { code: 'THREE_DAY_STREAK' } },
    });
    if (!streakBadgeEarned) {
      const streak = await this.prisma.streak.findUnique({ where: { userId } });
      if (streak && streak.currentStreak >= 3) {
        // Find the 3-day streak event or use a placeholder
        const streakEvent = await this.prisma.learningEvent.findFirst({
          where: { userId, eventType: 'streak.3day' },
        });
        await this.awardBadge(userId, 'THREE_DAY_STREAK', streakEvent?.id || null);
      }
    }

    // Check FIRST_CODE_ACCEPT
    const codeBadgeEarned = await this.prisma.userBadge.findFirst({
      where: { userId, badge: { code: 'FIRST_CODE_ACCEPT' } },
    });
    if (!codeBadgeEarned) {
      const acceptedSub = await this.prisma.learningEvent.findFirst({
        where: { userId, eventType: 'submission.accepted' },
      });
      if (acceptedSub) {
        await this.awardBadge(userId, 'FIRST_CODE_ACCEPT', acceptedSub.id);
      }
    }
  }

  private async awardBadge(userId: string, code: string, eventId: string | null): Promise<void> {
    const badge = await this.prisma.badge.findUnique({ where: { code } });
    if (!badge) return;

    try {
      await this.prisma.userBadge.create({
        data: {
          userId,
          badgeId: badge.id,
          awardedEventId: eventId,
        },
      });
      this.logger.log(`Awarded badge ${code} to user ${userId}`);
    } catch (err) {
      // Ignore if already awarded
    }
  }

  async getStreak(userId: string): Promise<any> {
    const streak = await this.prisma.streak.findUnique({ where: { userId } });
    return streak || { currentStreak: 0, longestStreak: 0, lastActivityDate: new Date() };
  }

  async getBadges(userId: string): Promise<any> {
    const allBadges = await this.prisma.badge.findMany({
      where: { status: 'active' },
    });
    const userBadges = await this.prisma.userBadge.findMany({
      where: { userId },
    });

    const earnedIds = new Set(userBadges.map((ub) => ub.badgeId));

    return allBadges.map((badge) => ({
      id: badge.id,
      code: badge.code,
      name: badge.name,
      description: badge.description,
      iconKey: badge.iconKey,
      earned: earnedIds.has(badge.id),
      earnedAt: userBadges.find((ub) => ub.badgeId === badge.id)?.awardedAt || null,
    }));
  }

  async getLeaderboard(): Promise<any> {
    const topUsers = await this.prisma.xpEvent.groupBy({
      by: ['userId'],
      _sum: { points: true },
      orderBy: { _sum: { points: 'desc' } },
      take: 10,
    });

    const leaderboard = [];
    for (const entry of topUsers) {
      const user = await this.prisma.user.findUnique({
        where: { id: entry.userId },
        select: { id: true, fullName: true, email: true },
      });
      if (user) {
        leaderboard.push({
          userId: user.id,
          fullName: user.fullName,
          xp: entry._sum.points || 0,
        });
      }
    }

    return leaderboard;
  }
}
