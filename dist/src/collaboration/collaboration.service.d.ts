import { PrismaService } from '../prisma/prisma.service';
export declare class CollaborationService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listWorkspaces(userId: string): Promise<({
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
    })[]>;
    createWorkspace(userId: string, name: string, description?: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        ownerId: string;
        visibility: string;
    }>;
    addMember(userId: string, workspaceId: string, memberEmail: string, role: string): Promise<{
        role: string;
        userId: string;
        workspaceId: string;
        joinedAt: Date;
    }>;
    changeMemberRole(userId: string, workspaceId: string, targetUserId: string, newRole: string): Promise<{
        role: string;
        userId: string;
        workspaceId: string;
        joinedAt: Date;
    }>;
    postMessage(userId: string, workspaceId: string, message: string): Promise<{
        message: string;
        id: string;
        createdAt: Date;
        workspaceId: string;
        attachmentIds: string[];
        deletedAt: Date | null;
        senderId: string;
    }>;
    private assertRole;
}
