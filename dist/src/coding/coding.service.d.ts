import { PrismaService } from '../prisma/prisma.service';
import { GamificationService } from '../gamification/gamification.service';
export declare class CodingService {
    private readonly prisma;
    private readonly gamificationService;
    constructor(prisma: PrismaService, gamificationService: GamificationService);
    listChallenges(filters: {
        difficulty?: string;
        skillTag?: string;
        limit?: number;
    }): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        title: string;
        skillTag: string;
        difficulty: string;
        slug: string;
        descriptionMd: string;
        supportedLanguages: string[];
        starterCode: import("@prisma/client/runtime/client").JsonValue;
    }[]>;
    getChallengeBySlug(slug: string): Promise<{
        testCases: {
            id: string;
            input: import("@prisma/client/runtime/client").JsonValue;
            expectedOutput: import("@prisma/client/runtime/client").JsonValue;
            weight: number;
        }[];
    } & {
        id: string;
        status: string;
        createdAt: Date;
        title: string;
        skillTag: string;
        difficulty: string;
        slug: string;
        descriptionMd: string;
        supportedLanguages: string[];
        starterCode: import("@prisma/client/runtime/client").JsonValue;
    }>;
    runSample(userId: string, challengeId: string, language: string, sourceCode: string): Promise<{
        status: string;
        tests: {
            total: number;
            passed: number;
            public_failed: never[];
        };
        runtime_ms: number;
        memory_kb: number;
    }>;
    submit(userId: string, challengeId: string, language: string, sourceCode: string): Promise<{
        submission_id: string;
        status: string;
    }>;
    getSubmission(userId: string, submissionId: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        userId: string;
        score: import("@prisma/client-runtime-utils").Decimal;
        challengeId: string;
        language: string;
        sourceCode: string;
        runtimeMs: number | null;
        memoryKb: number | null;
    }>;
    generateFeedback(userId: string, submissionId: string): Promise<{
        summary: string;
        hint_level: number;
        next_action: string;
    }>;
}
