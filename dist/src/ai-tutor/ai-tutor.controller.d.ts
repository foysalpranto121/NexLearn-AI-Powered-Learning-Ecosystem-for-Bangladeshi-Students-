import { AiTutorService } from './ai-tutor.service';
export declare class AiTutorController {
    private readonly aiTutorService;
    constructor(aiTutorService: AiTutorService);
    createSession(req: any, body: {
        title?: string;
        subject?: string;
        mode?: string;
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            title: string;
            subject: string | null;
            mode: string;
        };
    }>;
    getSessions(req: any, limit?: number): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            title: string;
            subject: string | null;
            mode: string;
        }[];
    }>;
    getSessionById(req: any, id: string): Promise<{
        success: boolean;
        data: {
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
        };
    }>;
    postMessage(req: any, id: string, message: string): Promise<{
        success: boolean;
        data: {
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
        };
    }>;
    deleteSession(req: any, id: string): Promise<{
        success: boolean;
        data: {
            success: boolean;
        };
    }>;
}
