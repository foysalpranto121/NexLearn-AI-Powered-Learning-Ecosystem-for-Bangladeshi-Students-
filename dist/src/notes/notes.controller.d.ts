import { NotesService } from './notes.service';
export declare class NotesController {
    private readonly notesService;
    constructor(notesService: NotesService);
    initUpload(req: any, body: {
        title: string;
        mime_type: string;
        file_size_bytes: number;
    }): Promise<{
        success: boolean;
        data: {
            document_id: string;
            upload_url: string;
            file_key: string;
        };
    }>;
    processDocument(req: any, documentId: string): Promise<{
        success: boolean;
        data: {
            status: string;
            job_id: string;
        };
    }>;
    list(req: any): Promise<{
        success: boolean;
        data: {
            id: string;
            status: string;
            createdAt: Date;
            userId: string;
            title: string;
            fileKey: string;
            mimeType: string;
            fileSizeBytes: bigint;
            extractedTextHash: string | null;
        }[];
    }>;
    getDocument(req: any, documentId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            status: string;
            createdAt: Date;
            userId: string;
            title: string;
            fileKey: string;
            mimeType: string;
            fileSizeBytes: bigint;
            extractedTextHash: string | null;
        };
    }>;
    generateSummaries(req: any, documentId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            content: import("@prisma/client/runtime/client").JsonValue;
            aiRunId: string | null;
            summaryType: string;
            documentId: string;
        };
    }>;
    getLatest(req: any, documentId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            content: import("@prisma/client/runtime/client").JsonValue;
            aiRunId: string | null;
            summaryType: string;
            documentId: string;
        };
    }>;
    deleteDocument(req: any, documentId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            status: string;
            createdAt: Date;
            userId: string;
            title: string;
            fileKey: string;
            mimeType: string;
            fileSizeBytes: bigint;
            extractedTextHash: string | null;
        };
    }>;
}
