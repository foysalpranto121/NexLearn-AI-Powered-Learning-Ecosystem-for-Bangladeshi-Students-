import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HackathonService {
  constructor(private readonly prisma: PrismaService) {}

  async listHackathons() {
    return this.prisma.hackathon.findMany({
      orderBy: { startDate: 'desc' },
    });
  }

  async createTeam(userId: string, hackathonId: string, name: string) {
    const hackathon = await this.prisma.hackathon.findUnique({
      where: { id: hackathonId },
    });
    if (!hackathon) {
      throw new NotFoundException('Hackathon not found');
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

  async inviteMember(userId: string, teamId: string, email: string) {
    const leader = await this.prisma.hackathonTeamMember.findFirst({
      where: { teamId, userId, role: 'leader' },
    });
    if (!leader) {
      throw new ForbiddenException('Only the team leader can invite members.');
    }

    const memberCount = await this.prisma.hackathonTeamMember.count({
      where: { teamId },
    });
    if (memberCount >= 5) {
      throw new BadRequestException('Team size limit reached (max 5 members).');
    }

    const userToInvite = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!userToInvite) {
      throw new NotFoundException('User with that email does not exist.');
    }

    const existingMember = await this.prisma.hackathonTeamMember.findUnique({
      where: {
        teamId_userId: { teamId, userId: userToInvite.id },
      },
    });
    if (existingMember) {
      throw new BadRequestException('User is already in this team.');
    }

    return this.prisma.hackathonTeamMember.create({
      data: {
        teamId,
        userId: userToInvite.id,
        role: 'member',
      },
    });
  }

  async updateProject(userId: string, teamId: string, data: { projectTitle?: string; repoUrl?: string }) {
    const member = await this.prisma.hackathonTeamMember.findUnique({
      where: {
        teamId_userId: { teamId, userId },
      },
    });
    if (!member) {
      throw new ForbiddenException('You must be a member of the team to update project details.');
    }

    return this.prisma.hackathonTeam.update({
      where: { id: teamId },
      data: {
        projectTitle: data.projectTitle,
        repoUrl: data.repoUrl,
      },
    });
  }

  async submitProject(userId: string, teamId: string, data: { pitchDeckUrl?: string; demoVideoUrl?: string }) {
    const member = await this.prisma.hackathonTeamMember.findUnique({
      where: {
        teamId_userId: { teamId, userId },
      },
    });
    if (!member) {
      throw new ForbiddenException('You must be a member of the team to register submissions.');
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
}
