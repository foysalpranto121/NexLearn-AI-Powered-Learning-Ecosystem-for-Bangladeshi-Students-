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
exports.AiOrchestratorService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AiOrchestratorService = class AiOrchestratorService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async logAiRun(userId, feature, promptVersion, inputData) {
        return this.prisma.aiRun.create({
            data: {
                userId,
                feature,
                provider: 'openai',
                model: 'gpt-4o-mini',
                promptVersion,
                inputHash: Buffer.from(JSON.stringify(inputData)).toString('base64').substring(0, 32),
                outputStatus: 'success',
                latencyMs: 1200,
                inputTokens: 120,
                outputTokens: 350,
                costUsd: 0.00052,
            },
        });
    }
    async generateStudyAnswer(userId, sessionId, message) {
        const run = await this.logAiRun(userId, 'ai_tutor', 'tutor.answer.v1', { sessionId, message });
        return {
            aiRunId: run.id,
            answer: `This is a study assistant response for query: "${message}". In production, this response is context-aware using student profiles and notes chunk retrieval.`,
            steps: [
                'Understand the core syntax details.',
                'Apply the logic block inside your component lifecycle.',
                'Validate the output variables recursively.',
            ],
            confidence: 'high',
            citations: [
                {
                    source_type: 'system_resource',
                    source_id: '11111111-2222-3333-4444-555555555555',
                    title: 'Official Documentation Primer',
                },
            ],
            follow_up_questions: [
                'How does this differ in production environments?',
                'Can we write an automated test to cover this edge case?',
            ],
            practice_task: {
                title: `Solve practice challenge for: ${message.substring(0, 10)}...`,
                difficulty: 'medium',
                estimated_minutes: 15,
            },
        };
    }
    async generateRoadmap(userId, targetCareer, currentLevel, timelineWeeks) {
        const run = await this.logAiRun(userId, 'roadmap', 'roadmap.generate.v1', { targetCareer, currentLevel, timelineWeeks });
        return {
            aiRunId: run.id,
            title: `${timelineWeeks}-week ${targetCareer} Path`,
            summary: `A structured pathway tailored for ${currentLevel} learners to build skills as a ${targetCareer}.`,
            nodes: [
                {
                    sequence_no: 1,
                    title: 'HTML Semantic Foundations',
                    description: 'Learn structural document tagging and markup structure.',
                    skill_tag: 'HTML',
                    difficulty: 'easy',
                    estimated_hours: 5.0,
                    due_week: 1,
                    prerequisite_sequence_numbers: [],
                    acceptance_task: 'Build a profile landing page with semantic nodes.',
                    resource_queries: ['HTML semantic tags', 'MDN semantics reference'],
                },
                {
                    sequence_no: 2,
                    title: 'CSS Custom Layouts',
                    description: 'Learn CSS Grid, Flexbox, and responsive layout styling.',
                    skill_tag: 'CSS',
                    difficulty: 'easy',
                    estimated_hours: 8.0,
                    due_week: 2,
                    prerequisite_sequence_numbers: [1],
                    acceptance_task: 'Style the semantic landing page responsive layout.',
                    resource_queries: ['CSS Grid layout MDN', 'CSS flexbox checklist'],
                },
            ],
            risk_flags: [],
            weekly_commitment_plan: [
                { week: 1, focus: 'Semantic HTML markup', hours: 10 },
                { week: 2, focus: 'Grid and Flex layouts', hours: 10 },
            ],
        };
    }
    async generateAnalyticsInsights(userId, data) {
        const run = await this.logAiRun(userId, 'analytics_insights', 'analytics.insights.v1', data);
        return {
            aiRunId: run.id,
            insights: [
                'You are highly active in the morning. Consider scheduling complex coding practice sessions between 9 AM and 11 AM.',
                'Your coding accuracy is 85% for JavaScript but drops to 45% for CSS custom layouts. We suggest starting a 25-minute focus session today focusing on CSS layouts.',
                'You completed all daily goals this week. Great consistency! This has maintained your streak at 8 days.',
            ],
            recommendedAction: 'Start a focus timer on CSS Grid layouts.',
        };
    }
};
exports.AiOrchestratorService = AiOrchestratorService;
exports.AiOrchestratorService = AiOrchestratorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AiOrchestratorService);
//# sourceMappingURL=ai-orchestrator.service.js.map