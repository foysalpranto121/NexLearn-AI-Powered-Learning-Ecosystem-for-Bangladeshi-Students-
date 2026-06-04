import { PrismaService } from '../../prisma/prisma.service';
export declare class AiOrchestratorService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    logAiRun(userId: string, feature: string, promptVersion: string, inputData: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        feature: string;
        provider: string;
        model: string;
        promptVersion: string;
        inputHash: string;
        outputStatus: string;
        latencyMs: number | null;
        inputTokens: number;
        outputTokens: number;
        costUsd: import("@prisma/client-runtime-utils").Decimal;
        errorCode: string | null;
    }>;
    generateStudyAnswer(userId: string, sessionId: string, message: string): Promise<{
        aiRunId: string;
        answer: string;
        steps: string[];
        confidence: string;
        citations: {
            source_type: string;
            source_id: string;
            title: string;
        }[];
        follow_up_questions: string[];
        practice_task: {
            title: string;
            difficulty: string;
            estimated_minutes: number;
        };
    }>;
    generateRoadmap(userId: string, targetCareer: string, currentLevel: string, timelineWeeks: number): Promise<{
        aiRunId: string;
        title: string;
        summary: string;
        nodes: {
            sequence_no: number;
            title: string;
            description: string;
            skill_tag: string;
            difficulty: string;
            estimated_hours: number;
            due_week: number;
            prerequisite_sequence_numbers: number[];
            acceptance_task: string;
            resource_queries: string[];
        }[];
        risk_flags: never[];
        weekly_commitment_plan: {
            week: number;
            focus: string;
            hours: number;
        }[];
    }>;
    generateAnalyticsInsights(userId: string, data: any): Promise<{
        aiRunId: string;
        insights: string[];
        recommendedAction: string;
    }>;
}
