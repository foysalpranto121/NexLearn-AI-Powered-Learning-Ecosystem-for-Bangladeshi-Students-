import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiOrchestratorService } from '../shared/ai-orchestrator/ai-orchestrator.service';
import { GamificationService } from '../gamification/gamification.service';

@Injectable()
export class RoadmapService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiOrchestrator: AiOrchestratorService,
    private readonly gamificationService: GamificationService,
  ) {}

  async generateRoadmap(
    userId: string,
    targetCareer: string,
    currentLevel: string,
    timelineWeeks: number,
  ) {
    // Check if an active roadmap exists and archive it
    await this.prisma.roadmaps.updateMany({
      where: { userId, status: 'active' },
      data: { status: 'archived' },
    });

    // Call orchestrator
    const aiRoadmap = await this.aiOrchestrator.generateRoadmap(userId, targetCareer, currentLevel, timelineWeeks);

    // Validate no cyclic prerequisites
    const isAcyclic = this.verifyAcyclic(aiRoadmap.nodes);
    if (!isAcyclic) {
      throw new ConflictException('Generated roadmap has cyclic prerequisites.');
    }

    // Save roadmap in DB
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

    // Save nodes
    const nodeSequenceMap = new Map<number, string>();
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

    // Resolve prerequisite UUIDs
    for (const node of aiRoadmap.nodes) {
      const prereqUuids = (node.prerequisite_sequence_numbers || [])
        .map((seq: number) => nodeSequenceMap.get(seq))
        .filter((uuid: string | undefined): uuid is string => uuid !== undefined);

      if (prereqUuids.length > 0) {
        await this.prisma.roadmapNode.update({
          where: {
            idx_roadmap_nodes_sequence: {
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

  async getCurrent(userId: string) {
    const roadmap = await this.prisma.roadmaps.findFirst({
      where: { userId, status: 'active' },
      include: {
        nodes: {
          orderBy: { sequenceNo: 'asc' },
        },
      },
    });

    if (!roadmap) {
      throw new NotFoundException('No active learning roadmap found');
    }

    return roadmap;
  }

  async getRoadmapById(userId: string, id: string) {
    const roadmap = await this.prisma.roadmaps.findFirst({
      where: { id, userId },
      include: {
        nodes: {
          orderBy: { sequenceNo: 'asc' },
        },
      },
    });

    if (!roadmap) {
      throw new NotFoundException('Roadmap not found');
    }

    return roadmap;
  }

  async updateNodeStatus(userId: string, roadmapId: string, nodeId: string, status: string) {
    const roadmap = await this.getRoadmapById(userId, roadmapId);
    
    const updatedNode = await this.prisma.roadmapNode.update({
      where: { id: nodeId, roadmapId: roadmap.id },
      data: { status },
    });

    if (status === 'completed') {
      // Update daily metric
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
      } catch (err) {
        // Ignore
      }

      // Emit learning event
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

      // Award XP
      await this.gamificationService.rewardEvent(event.id);
    }
    
    return updatedNode;
  }

  async regenerateNode(userId: string, roadmapId: string, nodeId: string) {
    const roadmap = await this.getRoadmapById(userId, roadmapId);
    const node = await this.prisma.roadmapNode.findFirst({
      where: { id: nodeId, roadmapId: roadmap.id },
    });

    if (!node) {
      throw new NotFoundException('Node not found on active roadmap');
    }

    // Mock regeneration details
    const updated = await this.prisma.roadmapNode.update({
      where: { id: nodeId },
      data: {
        description: `${node.description} (Regenerated for clarification)`,
        acceptanceTask: `${node.acceptanceTask} (Alternate Task)`,
      },
    });

    return updated;
  }

  async archiveRoadmap(userId: string, id: string) {
    const roadmap = await this.getRoadmapById(userId, id);
    return this.prisma.roadmaps.update({
      where: { id: roadmap.id },
      data: { status: 'archived' },
    });
  }

  private verifyAcyclic(nodes: any[]): boolean {
    const adj = new Map<number, number[]>();
    for (const node of nodes) {
      adj.set(node.sequence_no, node.prerequisite_sequence_numbers || []);
    }

    const visited = new Set<number>();
    const recStack = new Set<number>();

    const dfs = (curr: number): boolean => {
      if (recStack.has(curr)) return true; // Cycle detected
      if (visited.has(curr)) return false;

      visited.add(curr);
      recStack.add(curr);

      const neighbors = adj.get(curr) || [];
      for (const neighbor of neighbors) {
        if (dfs(neighbor)) return true;
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
}
