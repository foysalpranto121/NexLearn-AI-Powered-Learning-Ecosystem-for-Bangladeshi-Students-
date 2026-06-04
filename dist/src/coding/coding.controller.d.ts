import { CodingService } from './coding.service';
export declare class CodingController {
    private readonly codingService;
    constructor(codingService: CodingService);
    listChallenges(difficulty?: string, skillTag?: string, limit?: number): Promise<{
        success: boolean;
        data: {
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
        }[];
    }>;
    getChallenge(slug: string): Promise<{
        success: boolean;
        data: {
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
        };
    }>;
    runSample(req: any, id: string, body: {
        language: string;
        source_code: string;
    }): Promise<{
        success: boolean;
        data: {
            status: string;
            tests: {
                total: number;
                passed: number;
                public_failed: never[];
            };
            runtime_ms: number;
            memory_kb: number;
        };
    }>;
    submit(req: any, id: string, body: {
        language: string;
        source_code: string;
    }): Promise<{
        success: boolean;
        data: {
            submission_id: string;
            status: string;
        };
    }>;
    getSubmission(req: any, id: string): Promise<{
        success: boolean;
        data: {
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
        };
    }>;
    feedback(req: any, id: string): Promise<{
        success: boolean;
        data: {
            summary: string;
            hint_level: number;
            next_action: string;
        };
    }>;
}
