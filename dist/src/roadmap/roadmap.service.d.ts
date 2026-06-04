import { PrismaService } from '../prisma/prisma.service';
import { AiOrchestratorService } from '../shared/ai-orchestrator/ai-orchestrator.service';
import { GamificationService } from '../gamification/gamification.service';
export declare class RoadmapService {
    private readonly prisma;
    private readonly aiOrchestrator;
    private readonly gamificationService;
    constructor(prisma: PrismaService, aiOrchestrator: AiOrchestratorService, gamificationService: GamificationService);
    generateRoadmap(userId: string, targetCareer: string, currentLevel: string, timelineWeeks: number): Promise<{
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
    }>;
    getCurrent(userId: string): Promise<{
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
    }>;
    getRoadmapById(userId: string, id: string): Promise<{
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
    }>;
    updateNodeStatus(userId: string, roadmapId: string, nodeId: string, status: string): Promise<{
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
    }>;
    regenerateNode(userId: string, roadmapId: string, nodeId: string): Promise<{
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
    }>;
    archiveRoadmap(userId: string, id: string): Promise<{
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
    }>;
    private verifyAcyclic;
}
