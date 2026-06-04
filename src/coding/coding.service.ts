import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GamificationService } from '../gamification/gamification.service';

@Injectable()
export class CodingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gamificationService: GamificationService,
  ) {}

  async listChallenges(filters: { difficulty?: string; skillTag?: string; limit?: number }) {
    return this.prisma.codeChallenge.findMany({
      where: {
        status: 'published',
        ...(filters.difficulty ? { difficulty: filters.difficulty } : {}),
        ...(filters.skillTag ? { skillTag: filters.skillTag } : {}),
      },
      take: filters.limit || 20,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getChallengeBySlug(slug: string) {
    const challenge = await this.prisma.codeChallenge.findUnique({
      where: { slug },
      include: {
        testCases: {
          where: { isHidden: false },
          select: { id: true, input: true, expectedOutput: true, weight: true },
        },
      },
    });
    if (!challenge) throw new NotFoundException('Challenge not found');
    return challenge;
  }

  async runSample(userId: string, challengeId: string, language: string, sourceCode: string) {
    // In production: runs code against public samples via sandbox worker synchronously
    return {
      status: 'accepted',
      tests: { total: 2, passed: 2, public_failed: [] },
      runtime_ms: 42,
      memory_kb: 8192,
    };
  }

  async submit(userId: string, challengeId: string, language: string, sourceCode: string) {
    const submission = await this.prisma.codeSubmission.create({
      data: {
        userId,
        challengeId,
        language,
        sourceCode,
        status: 'queued',
      },
    });

    // In production: enqueue to BullMQ code_runner_queue
    // For scaffolding: simulate acceptance after queue processing
    await this.prisma.codeSubmission.update({
      where: { id: submission.id },
      data: { status: 'accepted', score: 100.0, runtimeMs: 138, memoryKb: 18420 },
    });

    // Update daily metrics
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
          codingAttempts: { increment: 1 },
          codingAccepts: { increment: 1 },
        },
        create: {
          userId,
          metricDate: new Date(todayStr),
          codingAttempts: 1,
          codingAccepts: 1,
        },
      });
    } catch (err) {
      // Ignore
    }

    // Emit learning event
    const event = await this.prisma.learningEvent.create({
      data: {
        userId,
        eventType: 'submission.accepted',
        entityType: 'code_submissions',
        entityId: submission.id,
        points: 40,
        metadata: { challengeId, language },
      },
    });

    // Reward XP & evaluate badges
    await this.gamificationService.rewardEvent(event.id);

    return { submission_id: submission.id, status: 'accepted' };
  }

  async getSubmission(userId: string, submissionId: string) {
    const submission = await this.prisma.codeSubmission.findFirst({
      where: { id: submissionId, userId },
    });
    if (!submission) throw new NotFoundException('Submission not found');
    return submission;
  }

  async generateFeedback(userId: string, submissionId: string) {
    const submission = await this.getSubmission(userId, submissionId);
    // In production: AI orchestrator generates feedback from failed test summary
    return {
      summary: 'Your logic handles the base case correctly but fails for edge cases with empty input.',
      hint_level: 1,
      next_action: 'Add a guard clause before the main loop to handle empty arrays.',
    };
  }
}
