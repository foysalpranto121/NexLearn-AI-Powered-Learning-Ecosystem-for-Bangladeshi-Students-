import { GamificationService } from './gamification.service';
export declare class GamificationController {
    private readonly gamificationService;
    constructor(gamificationService: GamificationService);
    getStreak(req: any): Promise<{
        success: boolean;
        data: any;
    }>;
    getBadges(req: any): Promise<{
        success: boolean;
        data: any;
    }>;
    getLeaderboard(): Promise<{
        success: boolean;
        data: any;
    }>;
}
