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
exports.GoalsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const gamification_service_1 = require("../gamification/gamification.service");
let GoalsService = class GoalsService {
    prisma;
    gamificationService;
    constructor(prisma, gamificationService) {
        this.prisma = prisma;
        this.gamificationService = gamificationService;
    }
    async getToday(userId, timezone) {
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        return this.prisma.dailyGoal.findMany({
            where: { userId, goalDate: new Date(todayStr) },
            orderBy: { createdAt: 'asc' },
        });
    }
    async create(userId, data) {
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
    async update(userId, id, data) {
        const goal = await this.prisma.dailyGoal.findFirst({ where: { id, userId } });
        if (!goal)
            throw new common_1.NotFoundException('Goal not found');
        return this.prisma.dailyGoal.update({ where: { id }, data });
    }
    async complete(userId, id) {
        const goal = await this.prisma.dailyGoal.findFirst({ where: { id, userId } });
        if (!goal)
            throw new common_1.NotFoundException('Goal not found');
        const updated = await this.prisma.dailyGoal.update({
            where: { id },
            data: { status: 'completed' },
        });
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
        await this.gamificationService.rewardEvent(event.id);
        return updated;
    }
    async suggest(userId) {
        return [
            { title: 'Study current roadmap node for 30 minutes', targetMinutes: 30, source: 'ai_suggested' },
            { title: 'Complete one coding challenge', targetMinutes: 20, source: 'ai_suggested' },
            { title: 'Review yesterday notes', targetMinutes: 15, source: 'ai_suggested' },
        ];
    }
};
exports.GoalsService = GoalsService;
exports.GoalsService = GoalsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        gamification_service_1.GamificationService])
], GoalsService);
//# sourceMappingURL=goals.service.js.map