import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/markdown',
  'image/png',
  'image/jpeg',
];
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  async initUpload(userId: string, title: string, mimeType: string, fileSizeBytes: number) {
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new BadRequestException(`Unsupported file type: ${mimeType}`);
    }
    if (fileSizeBytes > MAX_FILE_SIZE) {
      throw new BadRequestException('File exceeds 25 MB limit');
    }

    const fileKey = `uploads/${userId}/${Date.now()}-${title.replace(/\s+/g, '_')}`;

    const doc = await this.prisma.studyDocument.create({
      data: {
        userId,
        title,
        fileKey,
        mimeType,
        fileSizeBytes,
        status: 'uploaded',
      },
    });

    // In production: generate a pre-signed S3 PUT URL
    return {
      document_id: doc.id,
      upload_url: `https://s3.example.com/${fileKey}?signed=true`,
      file_key: fileKey,
    };
  }

  async processDocument(userId: string, documentId: string) {
    const doc = await this.prisma.studyDocument.findFirst({
      where: { id: documentId, userId },
    });
    if (!doc) throw new NotFoundException('Document not found');

    // In production: enqueue BullMQ job for text extraction, chunking, embedding
    await this.prisma.studyDocument.update({
      where: { id: documentId },
      data: { status: 'processing' },
    });

    // Simulate processing completion
    await this.prisma.studyDocument.update({
      where: { id: documentId },
      data: { status: 'ready' },
    });

    await this.prisma.learningEvent.create({
      data: {
        userId,
        eventType: 'notes.processed',
        entityType: 'study_documents',
        entityId: documentId,
        points: 5,
      },
    });

    return { status: 'processing', job_id: documentId };
  }

  async listDocuments(userId: string) {
    return this.prisma.studyDocument.findMany({
      where: { userId, status: { not: 'deleted' } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDocument(userId: string, documentId: string) {
    const doc = await this.prisma.studyDocument.findFirst({
      where: { id: documentId, userId },
    });
    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }

  async generateSummaries(userId: string, documentId: string) {
    const doc = await this.getDocument(userId, documentId);
    if (doc.status !== 'ready') {
      throw new BadRequestException('Document is not ready for summarization');
    }

    // In production: AI orchestrator generates summary, flashcards, quiz
    const summary = await this.prisma.generatedSummary.create({
      data: {
        documentId,
        summaryType: 'detailed',
        content: {
          summary: 'This document covers fundamental concepts...',
          key_points: ['Point 1', 'Point 2', 'Point 3'],
        },
      },
    });

    await this.prisma.learningEvent.create({
      data: {
        userId,
        eventType: 'notes.summary.generated',
        entityType: 'generated_summaries',
        entityId: summary.id,
        points: 15,
      },
    });

    return summary;
  }

  async getLatestSummary(userId: string, documentId: string) {
    await this.getDocument(userId, documentId);
    const summary = await this.prisma.generatedSummary.findFirst({
      where: { documentId },
      orderBy: { createdAt: 'desc' },
    });
    if (!summary) throw new NotFoundException('No summaries generated yet');
    return summary;
  }

  async deleteDocument(userId: string, documentId: string) {
    await this.getDocument(userId, documentId);
    return this.prisma.studyDocument.update({
      where: { id: documentId },
      data: { status: 'deleted' },
    });
  }
}
