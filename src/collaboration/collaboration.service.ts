import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CollaborationService {
  constructor(private readonly prisma: PrismaService) {}

  async listWorkspaces(userId: string) {
    return this.prisma.workspace.findMany({
      where: { members: { some: { userId } } },
      include: { members: { select: { userId: true, role: true } } },
    });
  }

  async createWorkspace(userId: string, name: string, description?: string) {
    const workspace = await this.prisma.workspace.create({
      data: {
        ownerId: userId,
        name,
        description,
        members: { create: { userId, role: 'owner' } },
      },
    });
    return workspace;
  }

  async addMember(userId: string, workspaceId: string, memberEmail: string, role: string) {
    await this.assertRole(userId, workspaceId, ['owner', 'admin']);
    const member = await this.prisma.user.findUnique({ where: { email: memberEmail } });
    if (!member) throw new NotFoundException('User not found');

    return this.prisma.workspaceMember.create({
      data: { workspaceId, userId: member.id, role: role || 'member' },
    });
  }

  async changeMemberRole(userId: string, workspaceId: string, targetUserId: string, newRole: string) {
    await this.assertRole(userId, workspaceId, ['owner']);
    return this.prisma.workspaceMember.update({
      where: { workspaceId_userId: { workspaceId, userId: targetUserId } },
      data: { role: newRole },
    });
  }

  async postMessage(userId: string, workspaceId: string, message: string) {
    await this.assertRole(userId, workspaceId, ['owner', 'admin', 'member']);
    return this.prisma.workspaceMessage.create({
      data: { workspaceId, senderId: userId, message },
    });
  }

  private async assertRole(userId: string, workspaceId: string, allowedRoles: string[]) {
    const membership = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } },
    });
    if (!membership || !allowedRoles.includes(membership.role)) {
      throw new ForbiddenException('FORBIDDEN');
    }
  }
}
