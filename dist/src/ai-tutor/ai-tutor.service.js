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
exports.AiTutorService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ai_orchestrator_service_1 = require("../shared/ai-orchestrator/ai-orchestrator.service");
let AiTutorService = class AiTutorService {
    prisma;
    aiOrchestrator;
    constructor(prisma, aiOrchestrator) {
        this.prisma = prisma;
        this.aiOrchestrator = aiOrchestrator;
    }
    async createSession(userId, title, subject, mode) {
        return this.prisma.aiTutorSession.create({
            data: {
                userId,
                title: title || 'New Study Session',
                subject: subject || 'General',
                mode: mode || 'tutor',
            },
        });
    }
    async getSessions(userId, limit = 20) {
        return this.prisma.aiTutorSession.findMany({
            where: { userId },
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
    }
    async getSessionById(userId, id) {
        const session = await this.prisma.aiTutorSession.findFirst({
            where: { id, userId },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
        if (!session) {
            throw new common_1.NotFoundException('Study session not found');
        }
        return session;
    }
    async postMessage(userId, sessionId, messageContent) {
        const session = await this.getSessionById(userId, sessionId);
        await this.prisma.aiTutorMessage.create({
            data: {
                sessionId: session.id,
                role: 'user',
                content: messageContent,
            },
        });
        const aiResponse = await this.aiOrchestrator.generateStudyAnswer(userId, sessionId, messageContent);
        const botMessage = await this.prisma.aiTutorMessage.create({
            data: {
                sessionId: session.id,
                role: 'assistant',
                content: aiResponse.answer,
                citations: aiResponse.citations,
            },
        });
        return {
            message: botMessage,
            answer: aiResponse.answer,
            steps: aiResponse.steps,
            confidence: aiResponse.confidence,
            citations: aiResponse.citations,
            follow_up_questions: aiResponse.follow_up_questions,
            practice_task: aiResponse.practice_task,
            ai_run_id: aiResponse.aiRunId,
        };
    }
    async deleteSession(userId, id) {
        const session = await this.getSessionById(userId, id);
        await this.prisma.aiTutorSession.delete({
            where: { id: session.id },
        });
        return { success: true };
    }
};
exports.AiTutorService = AiTutorService;
exports.AiTutorService = AiTutorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ai_orchestrator_service_1.AiOrchestratorService])
], AiTutorService);
//# sourceMappingURL=ai-tutor.service.js.map