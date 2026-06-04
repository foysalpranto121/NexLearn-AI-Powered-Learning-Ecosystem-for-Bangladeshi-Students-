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
exports.CollaborationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CollaborationService = class CollaborationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listWorkspaces(userId) {
        return this.prisma.workspace.findMany({
            where: { members: { some: { userId } } },
            include: { members: { select: { userId: true, role: true } } },
        });
    }
    async createWorkspace(userId, name, description) {
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
    async addMember(userId, workspaceId, memberEmail, role) {
        await this.assertRole(userId, workspaceId, ['owner', 'admin']);
        const member = await this.prisma.user.findUnique({ where: { email: memberEmail } });
        if (!member)
            throw new common_1.NotFoundException('User not found');
        return this.prisma.workspaceMember.create({
            data: { workspaceId, userId: member.id, role: role || 'member' },
        });
    }
    async changeMemberRole(userId, workspaceId, targetUserId, newRole) {
        await this.assertRole(userId, workspaceId, ['owner']);
        return this.prisma.workspaceMember.update({
            where: { workspaceId_userId: { workspaceId, userId: targetUserId } },
            data: { role: newRole },
        });
    }
    async postMessage(userId, workspaceId, message) {
        await this.assertRole(userId, workspaceId, ['owner', 'admin', 'member']);
        return this.prisma.workspaceMessage.create({
            data: { workspaceId, senderId: userId, message },
        });
    }
    async assertRole(userId, workspaceId, allowedRoles) {
        const membership = await this.prisma.workspaceMember.findUnique({
            where: { workspaceId_userId: { workspaceId, userId } },
        });
        if (!membership || !allowedRoles.includes(membership.role)) {
            throw new common_1.ForbiddenException('FORBIDDEN');
        }
    }
};
exports.CollaborationService = CollaborationService;
exports.CollaborationService = CollaborationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CollaborationService);
//# sourceMappingURL=collaboration.service.js.map