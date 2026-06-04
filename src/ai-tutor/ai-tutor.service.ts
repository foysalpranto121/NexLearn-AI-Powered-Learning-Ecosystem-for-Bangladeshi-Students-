import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiOrchestratorService } from '../shared/ai-orchestrator/ai-orchestrator.service';

@Injectable()
export class AiTutorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiOrchestrator: AiOrchestratorService,
  ) {}

  async createSession(userId: string, title?: string, subject?: string, mode?: string) {
    return this.prisma.aiTutorSession.create({
      data: {
        userId,
        title: title || 'New Study Session',
        subject: subject || 'General',
        mode: mode || 'tutor',
      },
    });
  }

  async getSessions(userId: string, limit = 20) {
    // Basic query, ignoring cursor pagination for scaffolding simplicity
    return this.prisma.aiTutorSession.findMany({
      where: { userId },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSessionById(userId: string, id: string) {
    const session = await this.prisma.aiTutorSession.findFirst({
      where: { id, userId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!session) {
      throw new NotFoundException('Study session not found');
    }

    return session;
  }

  async postMessage(userId: string, sessionId: string, messageContent: string) {
    const session = await this.getSessionById(userId, sessionId);

    // Save user message
    await this.prisma.aiTutorMessage.create({
      data: {
        sessionId: session.id,
        role: 'user',
        content: messageContent,
      },
    });

    // Call orchestrator to generate answer
    const aiResponse = await this.aiOrchestrator.generateStudyAnswer(userId, sessionId, messageContent);

    // Save assistant message
    const botMessage = await this.prisma.aiTutorMessage.create({
      data: {
        sessionId: session.id,
        role: 'assistant',
        content: aiResponse.answer,
        citations: aiResponse.citations,
      },
    });

    // Emit event asynchronously
    // In a full implementation, you would trigger learning events here.

    return {
      message: botMessage,
      answer: aiResponse.answer,
      steps: aiResponse.steps,
      confidence: aiResponse.confidence,
      citations: aiResponse.citations,
      follow_up_questions: aiResponse.follow_up_questions,
      practice_task: aiResponse.practice_task,
      ai_run_id: aiResponse.aiRunId,
    };
  }

  async deleteSession(userId: string, id: string) {
    const session = await this.getSessionById(userId, id);
    await this.prisma.aiTutorSession.delete({
      where: { id: session.id },
    });
    return { success: true };
  }
}
