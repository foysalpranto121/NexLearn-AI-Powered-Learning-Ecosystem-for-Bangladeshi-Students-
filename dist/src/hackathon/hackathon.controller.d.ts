import { HackathonService } from './hackathon.service';
export declare class HackathonController {
    private readonly hackathonService;
    constructor(hackathonService: HackathonService);
    listHackathons(): Promise<{
        success: boolean;
        data: {
            id: string;
            status: string;
            createdAt: Date;
            title: string;
            description: string;
            startDate: Date;
            endDate: Date;
        }[];
    }>;
    createTeam(req: any, hackathonId: string, body: {
        name: string;
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            name: string;
            projectTitle: string | null;
            repoUrl: string | null;
            hackathonId: string;
        };
    }>;
    inviteMember(req: any, teamId: string, body: {
        email: string;
    }): Promise<{
        success: boolean;
        data: {
            role: string;
            userId: string;
            teamId: string;
        };
    }>;
    updateProject(req: any, teamId: string, body: {
        projectTitle?: string;
        repoUrl?: string;
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            name: string;
            projectTitle: string | null;
            repoUrl: string | null;
            hackathonId: string;
        };
    }>;
    submitProject(req: any, teamId: string, body: {
        pitchDeckUrl?: string;
        demoVideoUrl?: string;
    }): Promise<{
        success: boolean;
        data: {
            id: string;
            teamId: string;
            pitchDeckUrl: string | null;
            demoVideoUrl: string | null;
            submittedAt: Date;
        };
    }>;
}
