import { GoalsService } from './goals.service';
export declare class GoalsController {
    private readonly goalsService;
    constructor(goalsService: GoalsService);
    getToday(req: any, tz?: string): Promise<{
        success: boolean;
        data: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            source: string;
            title: string;
            description: string | null;
            goalDate: Date;
            targetMinutes: number | null;
        }[];
    }>;
    create(req: any, body: any): Promise<{
        success: boolean;
        data: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            source: string;
            title: string;
            description: string | null;
            goalDate: Date;
            targetMinutes: number | null;
        };
    }>;
    update(req: any, id: string, body: any): Promise<{
        success: boolean;
        data: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            source: string;
            title: string;
            description: string | null;
            goalDate: Date;
            targetMinutes: number | null;
        };
    }>;
    complete(req: any, id: string): Promise<{
        success: boolean;
        data: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            source: string;
            title: string;
            description: string | null;
            goalDate: Date;
            targetMinutes: number | null;
        };
    }>;
    suggest(req: any): Promise<{
        success: boolean;
        data: {
            title: string;
            targetMinutes: number;
            source: string;
        }[];
    }>;
}
