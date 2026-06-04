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
exports.ProfileService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProfileService = class ProfileService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProfile(userId) {
        const profile = await this.prisma.userProfile.findUnique({
            where: { userId },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Profile not found');
        }
        return profile;
    }
    async updateProfile(userId, updateProfileDto) {
        const profile = await this.prisma.userProfile.upsert({
            where: { userId },
            update: updateProfileDto,
            create: {
                userId,
                targetCareer: updateProfileDto.targetCareer || '',
                currentLevel: updateProfileDto.currentLevel || 'beginner',
                weeklyHours: updateProfileDto.weeklyHours || 10,
                preferredLanguage: updateProfileDto.preferredLanguage || 'en',
                learningStyle: updateProfileDto.learningStyle || 'mixed',
                timezone: updateProfileDto.timezone || 'UTC',
            },
        });
        return profile;
    }
    async assessSkills(userId, skills) {
        const event = await this.prisma.learningEvent.create({
            data: {
                userId,
                eventType: 'profile.skills.assessment',
                entityType: 'user_profiles',
                entityId: userId,
                points: 0,
                metadata: { skills },
            },
        });
        return { eventId: event.id, status: 'saved' };
    }
};
exports.ProfileService = ProfileService;
exports.ProfileService = ProfileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProfileService);
//# sourceMappingURL=profile.service.js.map