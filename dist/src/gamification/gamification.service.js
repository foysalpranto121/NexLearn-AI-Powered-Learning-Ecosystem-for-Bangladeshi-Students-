"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var GamificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const analytics_service_1 = require("../analytics/analytics.service");
let GamificationService = GamificationService_1 = class GamificationService {
    prisma;
    analyticsService;
    logger = new common_1.Logger(GamificationService_1.name);
    constructor(prisma, analyticsService) {
        this.prisma = prisma;
        this.analyticsService = analyticsService;
    }
    async rewardEvent(eventId) {
        const event = await this.prisma.learningEvent.findUnique({
            where: { id: eventId },
        });
        if (!event) {
            this.logger.warn(`Learning event ${eventId} not found.`);
            return null;
        }
        const existingXp = await this.prisma.xpEvent.findUnique({
            where: { sourceEventId: eventId },
        });
        if (existingXp) {
            return existingXp;
        }
        let xpPoints = event.points || 10;
        let reason = `Activity completed: ${event.eventType}`;
        if (event.eventType === 'goal.completed') {
            const completedGoalsCount = await this.prisma.learningEvent.count({
                where: { userId: event.userId, eventType: 'goal.completed' },
            });
            if (completedGoalsCount === 1) {
                xpPoints = 20;
                reason = 'First goal completed bonus!';
            }
        }
        else if (event.eventType === 'submission.accepted') {
            const acceptedCount = await this.prisma.learningEvent.count({
                where: { userId: event.userId, eventType: 'submission.accepted' },
            });
            if (acceptedCount === 1) {
                xpPoints = 40;
                reason = 'First coding challenge accepted bonus!';
            }
        }
        else if (event.eventType === 'roadmap.node.completed') {
            xpPoints = 25;
            reason = 'Roadmap node completed!';
        }
        else if (event.eventType === 'notes.summary.completed') {
            xpPoints = 15;
            reason = 'Study notes summarized!';
        }
        else if (event.eventType === 'team.qa.accepted') {
            xpPoints = 30;
            reason = 'Q&A answer accepted by teammate!';
        }
        const xpEvent = await this.prisma.xpEvent.create({
            data: {
                userId: event.userId,
                sourceEventId: eventId,
                points: xpPoints,
                reason,
            },
        });
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
        }
        catch (err) {
            this.logger.warn(`Failed to update daily user metric XP: ${err.message}`);
        }
        if (event.eventType === 'goal.completed' || event.eventType === 'focus.completed') {
            await this.updateStreak(event.userId, todayStr);
        }
        await this.evaluateBadges(event.userId);
        await this.analyticsService.clearUserCache(event.userId);
        return xpEvent;
    }
    async updateStreak(userId, localDateStr) {
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
            if (nextStreak === 3) {
                const event = await this.prisma.learningEvent.create({
                    data: {
                        userId,
                        eventType: 'streak.3day',
                        points: 50,
                        metadata: { streakCount: 3 },
                    },
                });
                await this.rewardEvent(event.id);
            }
        }
        else if (diffDays > 1) {
            await this.prisma.streak.update({
                where: { userId },
                data: { currentStreak: 1, lastActivityDate: localDate },
            });
        }
    }
    async evaluateBadges(userId) {
        const defaultBadges = [
            { code: 'FIRST_GOAL', name: 'Goal Starter', description: 'Completed your first daily learning goal!' },
            { code: 'THREE_DAY_STREAK', name: 'Consistent Learner', description: 'Maintained a 3-day learning streak!' },
            { code: 'FIRST_CODE_ACCEPT', name: 'Code Warrior', description: 'Successfully solved your first coding challenge!' },
        ];
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
        const streakBadgeEarned = await this.prisma.userBadge.findFirst({
            where: { userId, badge: { code: 'THREE_DAY_STREAK' } },
        });
        if (!streakBadgeEarned) {
            const streak = await this.prisma.streak.findUnique({ where: { userId } });
            if (streak && streak.currentStreak >= 3) {
                const streakEvent = await this.prisma.learningEvent.findFirst({
                    where: { userId, eventType: 'streak.3day' },
                });
                await this.awardBadge(userId, 'THREE_DAY_STREAK', streakEvent?.id || null);
            }
        }
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
    async awardBadge(userId, code, eventId) {
        const badge = await this.prisma.badge.findUnique({ where: { code } });
        if (!badge)
            return;
        try {
            await this.prisma.userBadge.create({
                data: {
                    userId,
                    badgeId: badge.id,
                    awardedEventId: eventId,
                },
            });
            this.logger.log(`Awarded badge ${code} to user ${userId}`);
        }
        catch (err) {
        }
    }
    async getStreak(userId) {
        const streak = await this.prisma.streak.findUnique({ where: { userId } });
        return streak || { currentStreak: 0, longestStreak: 0, lastActivityDate: new Date() };
    }
    async getBadges(userId) {
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
    async getLeaderboard() {
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
};
exports.GamificationService = GamificationService;
exports.GamificationService = GamificationService = GamificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        analytics_service_1.AnalyticsService])
], GamificationService);
//# sourceMappingURL=gamification.service.js.map