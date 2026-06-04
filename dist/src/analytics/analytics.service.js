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
var AnalyticsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const redis_service_1 = require("../shared/redis.service");
const ai_orchestrator_service_1 = require("../shared/ai-orchestrator/ai-orchestrator.service");
let AnalyticsService = AnalyticsService_1 = class AnalyticsService {
    prisma;
    redis;
    aiOrchestrator;
    logger = new common_1.Logger(AnalyticsService_1.name);
    constructor(prisma, redis, aiOrchestrator) {
        this.prisma = prisma;
        this.redis = redis;
        this.aiOrchestrator = aiOrchestrator;
    }
    async getOverview(userId) {
        const cacheKey = `user:${userId}:analytics:overview`;
        const cached = await this.redis.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        const focusAgg = await this.prisma.focusSession.aggregate({
            where: { userId, status: 'completed' },
            _sum: { actualMinutes: true },
        });
        const metricsAgg = await this.prisma.dailyUserMetric.aggregate({
            where: { userId },
            _sum: { studyMinutes: true },
        });
        const total_study_minutes = (focusAgg._sum.actualMinutes || 0) + (metricsAgg._sum.studyMinutes || 0);
        const roadmap = await this.prisma.roadmaps.findFirst({
            where: { userId, status: 'active' },
            include: { nodes: true },
        });
        let roadmap_progress_percentage = 0;
        if (roadmap && roadmap.nodes.length > 0) {
            const completed = roadmap.nodes.filter((n) => n.status === 'completed').length;
            roadmap_progress_percentage = Math.round((completed / roadmap.nodes.length) * 1000) / 10;
        }
        const streak = await this.prisma.streak.findUnique({ where: { userId } });
        const streak_days = streak ? streak.currentStreak : 0;
        const xpAgg = await this.prisma.xpEvent.aggregate({
            where: { userId },
            _sum: { points: true },
        });
        const xp = xpAgg._sum.points || 0;
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
        await this.redis.set(cacheKey, JSON.stringify(data), 600);
        return data;
    }
    async getTrends(userId, startDateStr, endDateStr) {
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
    async getSkills(userId) {
        const cacheKey = `user:${userId}:analytics:skills`;
        const cached = await this.redis.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        const submissions = await this.prisma.codeSubmission.findMany({
            where: { userId },
            include: { challenge: true },
        });
        const tagStats = new Map();
        for (const sub of submissions) {
            const tag = sub.challenge.skillTag;
            if (!tagStats.has(tag)) {
                tagStats.set(tag, { total: 0, accepted: 0 });
            }
            const stats = tagStats.get(tag);
            stats.total++;
            if (sub.status === 'accepted') {
                stats.accepted++;
            }
        }
        const strengths = [];
        const weaknesses = [];
        for (const [tag, stats] of tagStats.entries()) {
            const accuracy = stats.accepted / stats.total;
            if (accuracy < 0.6) {
                weaknesses.push(tag);
            }
            else {
                strengths.push(tag);
            }
        }
        if (strengths.length === 0 && weaknesses.length === 0) {
            strengths.push('HTML', 'JavaScript');
            weaknesses.push('CSS');
        }
        const data = { strengths, weaknesses };
        await this.redis.set(cacheKey, JSON.stringify(data), 600);
        return data;
    }
    async generateInsights(userId) {
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
    async clearUserCache(userId) {
        this.logger.log(`Invalidating cache for user: ${userId}`);
        await this.redis.delPattern(`user:${userId}:analytics:*`);
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = AnalyticsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService,
        ai_orchestrator_service_1.AiOrchestratorService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map