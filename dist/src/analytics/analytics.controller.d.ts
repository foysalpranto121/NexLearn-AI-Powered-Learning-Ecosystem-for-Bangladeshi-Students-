import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getOverview(req: any): Promise<{
        success: boolean;
        data: any;
    }>;
    getTrends(req: any, startDate: string, endDate: string): Promise<{
        success: boolean;
        data: any;
    }>;
    getSkills(req: any): Promise<{
        success: boolean;
        data: any;
    }>;
    generateInsights(req: any): Promise<{
        success: boolean;
        data: any;
    }>;
}
