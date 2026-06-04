import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class ProfileController {
    private readonly profileService;
    constructor(profileService: ProfileService);
    getProfile(req: any): Promise<{
        success: boolean;
        data: {
            updatedAt: Date;
            targetCareer: string | null;
            currentLevel: string | null;
            weeklyHours: number | null;
            preferredLanguage: string;
            learningStyle: string | null;
            timezone: string;
            userId: string;
        };
    }>;
    updateProfile(req: any, updateProfileDto: UpdateProfileDto): Promise<{
        success: boolean;
        data: {
            updatedAt: Date;
            targetCareer: string | null;
            currentLevel: string | null;
            weeklyHours: number | null;
            preferredLanguage: string;
            learningStyle: string | null;
            timezone: string;
            userId: string;
        };
    }>;
    assessSkills(req: any, body: {
        skills: Array<{
            skill: string;
            score: number;
            source: string;
        }>;
    }): Promise<{
        success: boolean;
        data: {
            eventId: string;
            status: string;
        };
    }>;
}
