import { RoadmapService } from './roadmap.service';
export declare class RoadmapController {
    private readonly roadmapService;
    constructor(roadmapService: RoadmapService);
    generate(req: any, body: {
        target_career: string;
        current_level: string;
        timeline_weeks: number;
    }): Promise<{
        success: boolean;
        data: {
            nodes: {
                id: string;
                status: string;
                title: string;
                roadmapId: string;
                parentNodeId: string | null;
                description: string | null;
                skillTag: string;
                sequenceNo: number;
                difficulty: string | null;
                estimatedHours: import("@prisma/client-runtime-utils").Decimal;
                prerequisiteNodeIds: string[];
                acceptanceTask: string;
                dueWeek: number | null;
            }[];
        } & {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            targetCareer: string;
            currentLevel: string;
            userId: string;
            title: string;
            timelineWeeks: number;
            aiRunId: string | null;
        };
    }>;
    getCurrent(req: any): Promise<{
        success: boolean;
        data: {
            nodes: {
                id: string;
                status: string;
                title: string;
                roadmapId: string;
                parentNodeId: string | null;
                description: string | null;
                skillTag: string;
                sequenceNo: number;
                difficulty: string | null;
                estimatedHours: import("@prisma/client-runtime-utils").Decimal;
                prerequisiteNodeIds: string[];
                acceptanceTask: string;
                dueWeek: number | null;
            }[];
        } & {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            targetCareer: string;
            currentLevel: string;
            userId: string;
            title: string;
            timelineWeeks: number;
            aiRunId: string | null;
        };
    }>;
    getById(req: any, id: string): Promise<{
        success: boolean;
        data: {
            nodes: {
                id: string;
                status: string;
                title: string;
                roadmapId: string;
                parentNodeId: string | null;
                description: string | null;
                skillTag: string;
                sequenceNo: number;
                difficulty: string | null;
                estimatedHours: import("@prisma/client-runtime-utils").Decimal;
                prerequisiteNodeIds: string[];
                acceptanceTask: string;
                dueWeek: number | null;
            }[];
        } & {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            targetCareer: string;
            currentLevel: string;
            userId: string;
            title: string;
            timelineWeeks: number;
            aiRunId: string | null;
        };
    }>;
    updateNodeStatus(req: any, id: string, nodeId: string, status: string): Promise<{
        success: boolean;
        data: {
            id: string;
            status: string;
            title: string;
            roadmapId: string;
            parentNodeId: string | null;
            description: string | null;
            skillTag: string;
            sequenceNo: number;
            difficulty: string | null;
            estimatedHours: import("@prisma/client-runtime-utils").Decimal;
            prerequisiteNodeIds: string[];
            acceptanceTask: string;
            dueWeek: number | null;
        };
    }>;
    regenerateNode(req: any, id: string, nodeId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            status: string;
            title: string;
            roadmapId: string;
            parentNodeId: string | null;
            description: string | null;
            skillTag: string;
            sequenceNo: number;
            difficulty: string | null;
            estimatedHours: import("@prisma/client-runtime-utils").Decimal;
            prerequisiteNodeIds: string[];
            acceptanceTask: string;
            dueWeek: number | null;
        };
    }>;
    archive(req: any, id: string): Promise<{
        success: boolean;
        data: {
            id: string;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            targetCareer: string;
            currentLevel: string;
            userId: string;
            title: string;
            timelineWeeks: number;
            aiRunId: string | null;
        };
    }>;
}
