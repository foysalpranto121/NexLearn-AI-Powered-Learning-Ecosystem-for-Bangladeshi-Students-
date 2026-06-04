import { PrismaService } from '../prisma/prisma.service';
import { GamificationService } from '../gamification/gamification.service';
export declare class GoalsService {
    private readonly prisma;
    private readonly gamificationService;
    constructor(prisma: PrismaService, gamificationService: GamificationService);
    getToday(userId: string, timezone: string): Promise<{
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
    }[]>;
    create(userId: string, data: {
        title: string;
        description?: string;
        goalDate: string;
        targetMinutes?: number;
        source?: string;
    }): Promise<{
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
    }>;
    update(userId: string, id: string, data: Partial<{
        title: string;
        targetMinutes: number;
        status: string;
    }>): Promise<{
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
    }>;
    complete(userId: string, id: string): Promise<{
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
    }>;
    suggest(userId: string): Promise<{
        title: string;
        targetMinutes: number;
        source: string;
    }[]>;
}
