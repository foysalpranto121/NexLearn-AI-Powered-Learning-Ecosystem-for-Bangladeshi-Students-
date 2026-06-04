import { ProductivityService } from './productivity.service';
export declare class ProductivityController {
    private readonly productivityService;
    constructor(productivityService: ProductivityService);
    getActiveSession(req: any): Promise<{
        success: boolean;
        data: any;
    }>;
    getHistory(req: any): Promise<{
        success: boolean;
        data: any[];
    }>;
    startSession(req: any, body: {
        goal_id?: string;
        roadmap_node_id?: string;
        planned_minutes?: number;
        energy_before?: number;
    }): Promise<{
        success: boolean;
        data: any;
    }>;
    endSession(req: any, id: string, body: {
        status: 'completed' | 'abandoned';
        energy_after?: number;
    }): Promise<{
        success: boolean;
        data: any;
    }>;
}
