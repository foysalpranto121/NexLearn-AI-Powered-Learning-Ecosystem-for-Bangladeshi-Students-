import { PrismaService } from '../prisma/prisma.service';
import { GamificationService } from '../gamification/gamification.service';
export declare class ProductivityService {
    private readonly prisma;
    private readonly gamificationService;
    constructor(prisma: PrismaService, gamificationService: GamificationService);
    startSession(userId: string, data: {
        goalId?: string;
        roadmapNodeId?: string;
        plannedMinutes?: number;
        energyBefore?: number;
    }): Promise<any>;
    endSession(userId: string, id: string, data: {
        status: 'completed' | 'abandoned';
        energyAfter?: number;
    }): Promise<any>;
    getActiveSession(userId: string): Promise<any>;
    getHistory(userId: string): Promise<any[]>;
}
