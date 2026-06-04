import { PrismaService } from '../prisma/prisma.service';
export declare class HackathonService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listHackathons(): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        title: string;
        description: string;
        startDate: Date;
        endDate: Date;
    }[]>;
    createTeam(userId: string, hackathonId: string, name: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        projectTitle: string | null;
        repoUrl: string | null;
        hackathonId: string;
    }>;
    inviteMember(userId: string, teamId: string, email: string): Promise<{
        role: string;
        userId: string;
        teamId: string;
    }>;
    updateProject(userId: string, teamId: string, data: {
        projectTitle?: string;
        repoUrl?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        projectTitle: string | null;
        repoUrl: string | null;
        hackathonId: string;
    }>;
    submitProject(userId: string, teamId: string, data: {
        pitchDeckUrl?: string;
        demoVideoUrl?: string;
    }): Promise<{
        id: string;
        teamId: string;
        pitchDeckUrl: string | null;
        demoVideoUrl: string | null;
        submittedAt: Date;
    }>;
}
