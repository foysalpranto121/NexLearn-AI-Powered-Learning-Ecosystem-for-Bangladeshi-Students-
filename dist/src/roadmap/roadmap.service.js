"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoadmapService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ai_orchestrator_service_1 = require("../shared/ai-orchestrator/ai-orchestrator.service");
const gamification_service_1 = require("../gamification/gamification.service");
let RoadmapService = class RoadmapService {
    prisma;
    aiOrchestrator;
    gamificationService;
    constructor(prisma, aiOrchestrator, gamificationService) {
        this.prisma = prisma;
        this.aiOrchestrator = aiOrchestrator;
        this.gamificationService = gamificationService;
    }
    async generateRoadmap(userId, targetCareer, currentLevel, timelineWeeks) {
        await this.prisma.roadmaps.updateMany({
            where: { userId, status: 'active' },
            data: { status: 'archived' },
        });
        const aiRoadmap = await this.aiOrchestrator.generateRoadmap(userId, targetCareer, currentLevel, timelineWeeks);
        const isAcyclic = this.verifyAcyclic(aiRoadmap.nodes);
        if (!isAcyclic) {
            throw new common_1.ConflictException('Generated roadmap has cyclic prerequisites.');
        }
        const roadmap = await this.prisma.roadmaps.create({
            data: {
                userId,
                title: aiRoadmap.title,
                targetCareer,
                currentLevel,
                timelineWeeks,
                status: 'active',
                aiRunId: aiRoadmap.aiRunId,
            },
        });
        const nodeSequenceMap = new Map();
        for (const node of aiRoadmap.nodes) {
            const createdNode = await this.prisma.roadmapNode.create({
                data: {
                    roadmapId: roadmap.id,
                    title: node.title,
                    description: node.description,
                    skillTag: node.skill_tag,
                    sequenceNo: node.sequence_no,
                    difficulty: node.difficulty,
                    estimatedHours: node.estimated_hours,
                    acceptanceTask: node.acceptance_task,
                    status: 'not_started',
                    dueWeek: node.due_week,
                },
            });
            nodeSequenceMap.set(node.sequence_no, createdNode.id);
        }
        for (const node of aiRoadmap.nodes) {
            const prereqUuids = (node.prerequisite_sequence_numbers || [])
                .map((seq) => nodeSequenceMap.get(seq))
                .filter((uuid) => uuid !== undefined);
            if (prereqUuids.length > 0) {
                await this.prisma.roadmapNode.update({
                    where: {
                        roadmapId_sequenceNo: {
                            roadmapId: roadmap.id,
                            sequenceNo: node.sequence_no,
                        },
                    },
                    data: {
                        prerequisiteNodeIds: prereqUuids,
                    },
                });
            }
        }
        return this.getCurrent(userId);
    }
    async getCurrent(userId) {
        const roadmap = await this.prisma.roadmaps.findFirst({
            where: { userId, status: 'active' },
            include: {
                nodes: {
                    orderBy: { sequenceNo: 'asc' },
                },
            },
        });
        if (!roadmap) {
            throw new common_1.NotFoundException('No active learning roadmap found');
        }
        return roadmap;
    }
    async getRoadmapById(userId, id) {
        const roadmap = await this.prisma.roadmaps.findFirst({
            where: { id, userId },
            include: {
                nodes: {
                    orderBy: { sequenceNo: 'asc' },
                },
            },
        });
        if (!roadmap) {
            throw new common_1.NotFoundException('Roadmap not found');
        }
        return roadmap;
    }
    async updateNodeStatus(userId, roadmapId, nodeId, status) {
        const roadmap = await this.getRoadmapById(userId, roadmapId);
        const updatedNode = await this.prisma.roadmapNode.update({
            where: { id: nodeId, roadmapId: roadmap.id },
            data: { status },
        });
        if (status === 'completed') {
            const todayStr = new Date().toISOString().split('T')[0];
            try {
                await this.prisma.dailyUserMetric.upsert({
                    where: {
                        userId_metricDate: {
                            userId,
                            metricDate: new Date(todayStr),
                        },
                    },
                    update: {
                        roadmapNodesCompleted: { increment: 1 },
                    },
                    create: {
                        userId,
                        metricDate: new Date(todayStr),
                        roadmapNodesCompleted: 1,
                    },
                });
            }
            catch (err) {
            }
            const event = await this.prisma.learningEvent.create({
                data: {
                    userId,
                    eventType: 'roadmap.node.completed',
                    entityType: 'roadmap_nodes',
                    entityId: nodeId,
                    points: 25,
                    metadata: { roadmapId, nodeId },
                },
            });
            await this.gamificationService.rewardEvent(event.id);
        }
        return updatedNode;
    }
    async regenerateNode(userId, roadmapId, nodeId) {
        const roadmap = await this.getRoadmapById(userId, roadmapId);
        const node = await this.prisma.roadmapNode.findFirst({
            where: { id: nodeId, roadmapId: roadmap.id },
        });
        if (!node) {
            throw new common_1.NotFoundException('Node not found on active roadmap');
        }
        const updated = await this.prisma.roadmapNode.update({
            where: { id: nodeId },
            data: {
                description: `${node.description} (Regenerated for clarification)`,
                acceptanceTask: `${node.acceptanceTask} (Alternate Task)`,
            },
        });
        return updated;
    }
    async archiveRoadmap(userId, id) {
        const roadmap = await this.getRoadmapById(userId, id);
        return this.prisma.roadmaps.update({
            where: { id: roadmap.id },
            data: { status: 'archived' },
        });
    }
    verifyAcyclic(nodes) {
        const adj = new Map();
        for (const node of nodes) {
            adj.set(node.sequence_no, node.prerequisite_sequence_numbers || []);
        }
        const visited = new Set();
        const recStack = new Set();
        const dfs = (curr) => {
            if (recStack.has(curr))
                return true;
            if (visited.has(curr))
                return false;
            visited.add(curr);
            recStack.add(curr);
            const neighbors = adj.get(curr) || [];
            for (const neighbor of neighbors) {
                if (dfs(neighbor))
                    return true;
            }
            recStack.delete(curr);
            return false;
        };
        for (const node of nodes) {
            if (dfs(node.sequence_no)) {
                return false;
            }
        }
        return true;
    }
};
exports.RoadmapService = RoadmapService;
exports.RoadmapService = RoadmapService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ai_orchestrator_service_1.AiOrchestratorService,
        gamification_service_1.GamificationService])
], RoadmapService);
//# sourceMappingURL=roadmap.service.js.map