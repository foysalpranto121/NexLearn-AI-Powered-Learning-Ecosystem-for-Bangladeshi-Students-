import { CollaborationService } from './collaboration.service';
export declare class CollaborationController {
    private readonly collaborationService;
    constructor(collaborationService: CollaborationService);
    list(req: any): Promise<{
        success: boolean;
        data: ({
            members: {
                role: string;
                userId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            ownerId: string;
            visibility: string;
        })[];
    }>;
    create(req: any, body: {
        name: string;
        description?: string;
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            name: string;
            description: string | null;
            ownerId: string;
            visibility: string;
        };
    }>;
    addMember(req: any, id: string, body: {
        email: string;
        role?: string;
    }): Promise<{
        success: boolean;
        data: {
            role: string;
            userId: string;
            workspaceId: string;
            joinedAt: Date;
        };
    }>;
    changeMemberRole(req: any, id: string, targetUserId: string, role: string): Promise<{
        success: boolean;
        data: {
            role: string;
            userId: string;
            workspaceId: string;
            joinedAt: Date;
        };
    }>;
    postMessage(req: any, id: string, message: string): Promise<{
        success: boolean;
        data: {
            message: string;
            id: string;
            createdAt: Date;
            workspaceId: string;
            attachmentIds: string[];
            deletedAt: Date | null;
            senderId: string;
        };
    }>;
}
