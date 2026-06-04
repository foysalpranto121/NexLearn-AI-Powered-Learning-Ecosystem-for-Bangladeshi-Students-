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
exports.NotesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/markdown',
    'image/png',
    'image/jpeg',
];
const MAX_FILE_SIZE = 25 * 1024 * 1024;
let NotesService = class NotesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async initUpload(userId, title, mimeType, fileSizeBytes) {
        if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
            throw new common_1.BadRequestException(`Unsupported file type: ${mimeType}`);
        }
        if (fileSizeBytes > MAX_FILE_SIZE) {
            throw new common_1.BadRequestException('File exceeds 25 MB limit');
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
        return {
            document_id: doc.id,
            upload_url: `https://s3.example.com/${fileKey}?signed=true`,
            file_key: fileKey,
        };
    }
    async processDocument(userId, documentId) {
        const doc = await this.prisma.studyDocument.findFirst({
            where: { id: documentId, userId },
        });
        if (!doc)
            throw new common_1.NotFoundException('Document not found');
        await this.prisma.studyDocument.update({
            where: { id: documentId },
            data: { status: 'processing' },
        });
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
    async listDocuments(userId) {
        return this.prisma.studyDocument.findMany({
            where: { userId, status: { not: 'deleted' } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getDocument(userId, documentId) {
        const doc = await this.prisma.studyDocument.findFirst({
            where: { id: documentId, userId },
        });
        if (!doc)
            throw new common_1.NotFoundException('Document not found');
        return doc;
    }
    async generateSummaries(userId, documentId) {
        const doc = await this.getDocument(userId, documentId);
        if (doc.status !== 'ready') {
            throw new common_1.BadRequestException('Document is not ready for summarization');
        }
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
    async getLatestSummary(userId, documentId) {
        await this.getDocument(userId, documentId);
        const summary = await this.prisma.generatedSummary.findFirst({
            where: { documentId },
            orderBy: { createdAt: 'desc' },
        });
        if (!summary)
            throw new common_1.NotFoundException('No summaries generated yet');
        return summary;
    }
    async deleteDocument(userId, documentId) {
        await this.getDocument(userId, documentId);
        return this.prisma.studyDocument.update({
            where: { id: documentId },
            data: { status: 'deleted' },
        });
    }
};
exports.NotesService = NotesService;
exports.NotesService = NotesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotesService);
//# sourceMappingURL=notes.service.js.map