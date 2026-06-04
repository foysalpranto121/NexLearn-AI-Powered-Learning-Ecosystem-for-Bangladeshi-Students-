import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../shared/redis.service';
import { AiOrchestratorService } from '../shared/ai-orchestrator/ai-orchestrator.service';
export declare class AnalyticsService {
    private readonly prisma;
    private readonly redis;
    private readonly aiOrchestrator;
    private readonly logger;
    constructor(prisma: PrismaService, redis: RedisService, aiOrchestrator: AiOrchestratorService);
    getOverview(userId: string): Promise<any>;
    getTrends(userId: string, startDateStr: string, endDateStr: string): Promise<any>;
    getSkills(userId: string): Promise<any>;
    generateInsights(userId: string): Promise<any>;
    clearUserCache(userId: string): Promise<void>;
}
