import { PrismaService } from '../prisma/prisma.service';
export declare class NotesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    initUpload(userId: string, title: string, mimeType: string, fileSizeBytes: number): Promise<{
        document_id: string;
        upload_url: string;
        file_key: string;
    }>;
    processDocument(userId: string, documentId: string): Promise<{
        status: string;
        job_id: string;
    }>;
    listDocuments(userId: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        userId: string;
        title: string;
        fileKey: string;
        mimeType: string;
        fileSizeBytes: bigint;
        extractedTextHash: string | null;
    }[]>;
    getDocument(userId: string, documentId: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        userId: string;
        title: string;
        fileKey: string;
        mimeType: string;
        fileSizeBytes: bigint;
        extractedTextHash: string | null;
    }>;
    generateSummaries(userId: string, documentId: string): Promise<{
        id: string;
        createdAt: Date;
        content: import("@prisma/client/runtime/client").JsonValue;
        aiRunId: string | null;
        summaryType: string;
        documentId: string;
    }>;
    getLatestSummary(userId: string, documentId: string): Promise<{
        id: string;
        createdAt: Date;
        content: import("@prisma/client/runtime/client").JsonValue;
        aiRunId: string | null;
        summaryType: string;
        documentId: string;
    }>;
    deleteDocument(userId: string, documentId: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        userId: string;
        title: string;
        fileKey: string;
        mimeType: string;
        fileSizeBytes: bigint;
        extractedTextHash: string | null;
    }>;
}
