import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class ProfileService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<{
        updatedAt: Date;
        targetCareer: string | null;
        currentLevel: string | null;
        weeklyHours: number | null;
        preferredLanguage: string;
        learningStyle: string | null;
        timezone: string;
        userId: string;
    }>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<{
        updatedAt: Date;
        targetCareer: string | null;
        currentLevel: string | null;
        weeklyHours: number | null;
        preferredLanguage: string;
        learningStyle: string | null;
        timezone: string;
        userId: string;
    }>;
    assessSkills(userId: string, skills: Array<{
        skill: string;
        score: number;
        source: string;
    }>): Promise<{
        eventId: string;
        status: string;
    }>;
}
