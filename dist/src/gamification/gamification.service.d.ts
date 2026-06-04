import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsService } from '../analytics/analytics.service';
export declare class GamificationService {
    private readonly prisma;
    private readonly analyticsService;
    private readonly logger;
    constructor(prisma: PrismaService, analyticsService: AnalyticsService);
    rewardEvent(eventId: string): Promise<any>;
    updateStreak(userId: string, localDateStr: string): Promise<void>;
    private evaluateBadges;
    private awardBadge;
    getStreak(userId: string): Promise<any>;
    getBadges(userId: string): Promise<any>;
    getLeaderboard(): Promise<any>;
}
