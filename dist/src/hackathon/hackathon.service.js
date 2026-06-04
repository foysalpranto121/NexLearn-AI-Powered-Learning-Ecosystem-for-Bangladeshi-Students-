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
exports.HackathonService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let HackathonService = class HackathonService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listHackathons() {
        return this.prisma.hackathon.findMany({
            orderBy: { startDate: 'desc' },
        });
    }
    async createTeam(userId, hackathonId, name) {
        const hackathon = await this.prisma.hackathon.findUnique({
            where: { id: hackathonId },
        });
        if (!hackathon) {
            throw new common_1.NotFoundException('Hackathon not found');
        }
        return this.prisma.$transaction(async (tx) => {
            const team = await tx.hackathonTeam.create({
                data: {
                    hackathonId,
                    name,
                },
            });
            await tx.hackathonTeamMember.create({
                data: {
                    teamId: team.id,
                    userId,
                    role: 'leader',
                },
            });
            return team;
        });
    }
    async inviteMember(userId, teamId, email) {
        const leader = await this.prisma.hackathonTeamMember.findFirst({
            where: { teamId, userId, role: 'leader' },
        });
        if (!leader) {
            throw new common_1.ForbiddenException('Only the team leader can invite members.');
        }
        const memberCount = await this.prisma.hackathonTeamMember.count({
            where: { teamId },
        });
        if (memberCount >= 5) {
            throw new common_1.BadRequestException('Team size limit reached (max 5 members).');
        }
        const userToInvite = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!userToInvite) {
            throw new common_1.NotFoundException('User with that email does not exist.');
        }
        const existingMember = await this.prisma.hackathonTeamMember.findUnique({
            where: {
                teamId_userId: { teamId, userId: userToInvite.id },
            },
        });
        if (existingMember) {
            throw new common_1.BadRequestException('User is already in this team.');
        }
        return this.prisma.hackathonTeamMember.create({
            data: {
                teamId,
                userId: userToInvite.id,
                role: 'member',
            },
        });
    }
    async updateProject(userId, teamId, data) {
        const member = await this.prisma.hackathonTeamMember.findUnique({
            where: {
                teamId_userId: { teamId, userId },
            },
        });
        if (!member) {
            throw new common_1.ForbiddenException('You must be a member of the team to update project details.');
        }
        return this.prisma.hackathonTeam.update({
            where: { id: teamId },
            data: {
                projectTitle: data.projectTitle,
                repoUrl: data.repoUrl,
            },
        });
    }
    async submitProject(userId, teamId, data) {
        const member = await this.prisma.hackathonTeamMember.findUnique({
            where: {
                teamId_userId: { teamId, userId },
            },
        });
        if (!member) {
            throw new common_1.ForbiddenException('You must be a member of the team to register submissions.');
        }
        return this.prisma.hackathonSubmission.create({
            data: {
                teamId,
                pitchDeckUrl: data.pitchDeckUrl,
                demoVideoUrl: data.demoVideoUrl,
                submittedAt: new Date(),
            },
        });
    }
};
exports.HackathonService = HackathonService;
exports.HackathonService = HackathonService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HackathonService);
//# sourceMappingURL=hackathon.service.js.map