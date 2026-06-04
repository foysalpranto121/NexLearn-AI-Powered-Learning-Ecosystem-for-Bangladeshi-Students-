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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductivityService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const gamification_service_1 = require("../gamification/gamification.service");
let ProductivityService = class ProductivityService {
    prisma;
    gamificationService;
    constructor(prisma, gamificationService) {
        this.prisma = prisma;
        this.gamificationService = gamificationService;
    }
    async startSession(userId, data) {
        const runningSession = await this.prisma.focusSession.findFirst({
            where: { userId, status: 'running' },
        });
        if (runningSession) {
            throw new common_1.BadRequestException('You already have an active focus session running.');
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
    async endSession(userId, id, data) {
        const session = await this.prisma.focusSession.findFirst({
            where: { id, userId },
        });
        if (!session) {
            throw new common_1.NotFoundException('Focus session not found.');
        }
        if (session.status !== 'running') {
            throw new common_1.BadRequestException('This focus session has already ended.');
        }
        const endedAt = new Date();
        const actualMinutes = Math.max(1, Math.round((endedAt.getTime() - new Date(session.startedAt).getTime()) / (60 * 1000)));
        const updatedSession = await this.prisma.focusSession.update({
            where: { id },
            data: {
                status: data.status,
                endedAt,
                actualMinutes,
                energyAfter: data.energyAfter || null,
            },
        });
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
        }
        catch (err) {
        }
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
        if (pointsAwarded > 0) {
            await this.gamificationService.rewardEvent(event.id);
        }
        return updatedSession;
    }
    async getActiveSession(userId) {
        return this.prisma.focusSession.findFirst({
            where: { userId, status: 'running' },
        });
    }
    async getHistory(userId) {
        return this.prisma.focusSession.findMany({
            where: { userId },
            orderBy: { startedAt: 'desc' },
            take: 20,
        });
    }
};
exports.ProductivityService = ProductivityService;
exports.ProductivityService = ProductivityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        gamification_service_1.GamificationService])
], ProductivityService);
//# sourceMappingURL=productivity.service.js.map