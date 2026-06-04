import { PrismaService } from '../prisma/prisma.service';
import { AiOrchestratorService } from '../shared/ai-orchestrator/ai-orchestrator.service';
export declare class AiTutorService {
    private readonly prisma;
    private readonly aiOrchestrator;
    constructor(prisma: PrismaService, aiOrchestrator: AiOrchestratorService);
    createSession(userId: string, title?: string, subject?: string, mode?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        subject: string | null;
        mode: string;
    }>;
    getSessions(userId: string, limit?: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        subject: string | null;
        mode: string;
    }[]>;
    getSessionById(userId: string, id: string): Promise<{
        messages: {
            id: string;
            role: string;
            createdAt: Date;
            content: string;
            citations: import("@prisma/client/runtime/client").JsonValue;
            tokenCount: number;
            sessionId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        subject: string | null;
        mode: string;
    }>;
    postMessage(userId: string, sessionId: string, messageContent: string): Promise<{
        message: {
            id: string;
            role: string;
            createdAt: Date;
            content: string;
            citations: import("@prisma/client/runtime/client").JsonValue;
            tokenCount: number;
            sessionId: string;
        };
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
        ai_run_id: string;
    }>;
    deleteSession(userId: string, id: string): Promise<{
        success: boolean;
    }>;
}
