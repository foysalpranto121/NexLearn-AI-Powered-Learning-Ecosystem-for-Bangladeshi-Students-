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
exports.CodingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const gamification_service_1 = require("../gamification/gamification.service");
let CodingService = class CodingService {
    prisma;
    gamificationService;
    constructor(prisma, gamificationService) {
        this.prisma = prisma;
        this.gamificationService = gamificationService;
    }
    async listChallenges(filters) {
        return this.prisma.codeChallenge.findMany({
            where: {
                status: 'published',
                ...(filters.difficulty ? { difficulty: filters.difficulty } : {}),
                ...(filters.skillTag ? { skillTag: filters.skillTag } : {}),
            },
            take: filters.limit || 20,
            orderBy: { createdAt: 'desc' },
        });
    }
    async getChallengeBySlug(slug) {
        const challenge = await this.prisma.codeChallenge.findUnique({
            where: { slug },
            include: {
                testCases: {
                    where: { isHidden: false },
                    select: { id: true, input: true, expectedOutput: true, weight: true },
                },
            },
        });
        if (!challenge)
            throw new common_1.NotFoundException('Challenge not found');
        return challenge;
    }
    async runSample(userId, challengeId, language, sourceCode) {
        return {
            status: 'accepted',
            tests: { total: 2, passed: 2, public_failed: [] },
            runtime_ms: 42,
            memory_kb: 8192,
        };
    }
    async submit(userId, challengeId, language, sourceCode) {
        const submission = await this.prisma.codeSubmission.create({
            data: {
                userId,
                challengeId,
                language,
                sourceCode,
                status: 'queued',
            },
        });
        await this.prisma.codeSubmission.update({
            where: { id: submission.id },
            data: { status: 'accepted', score: 100.0, runtimeMs: 138, memoryKb: 18420 },
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
                    codingAttempts: { increment: 1 },
                    codingAccepts: { increment: 1 },
                },
                create: {
                    userId,
                    metricDate: new Date(todayStr),
                    codingAttempts: 1,
                    codingAccepts: 1,
                },
            });
        }
        catch (err) {
        }
        const event = await this.prisma.learningEvent.create({
            data: {
                userId,
                eventType: 'submission.accepted',
                entityType: 'code_submissions',
                entityId: submission.id,
                points: 40,
                metadata: { challengeId, language },
            },
        });
        await this.gamificationService.rewardEvent(event.id);
        return { submission_id: submission.id, status: 'accepted' };
    }
    async getSubmission(userId, submissionId) {
        const submission = await this.prisma.codeSubmission.findFirst({
            where: { id: submissionId, userId },
        });
        if (!submission)
            throw new common_1.NotFoundException('Submission not found');
        return submission;
    }
    async generateFeedback(userId, submissionId) {
        const submission = await this.getSubmission(userId, submissionId);
        return {
            summary: 'Your logic handles the base case correctly but fails for edge cases with empty input.',
            hint_level: 1,
            next_action: 'Add a guard clause before the main loop to handle empty arrays.',
        };
    }
};
exports.CodingService = CodingService;
exports.CodingService = CodingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        gamification_service_1.GamificationService])
], CodingService);
//# sourceMappingURL=coding.service.js.map