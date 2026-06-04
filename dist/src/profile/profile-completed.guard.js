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
exports.ProfileCompletedGuard = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProfileCompletedGuard = class ProfileCompletedGuard {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            return false;
        }
        const profile = await this.prisma.userProfile.findUnique({
            where: { userId: user.id },
        });
        if (!profile) {
            throw new common_1.ConflictException({
                statusCode: 409,
                error: 'PROFILE_INCOMPLETE',
                message: 'Onboarding profile must be completed first.',
                details: ['target_career', 'current_level', 'weekly_hours', 'learning_style'],
            });
        }
        const missingFields = [];
        if (!profile.targetCareer)
            missingFields.push('target_career');
        if (!profile.currentLevel)
            missingFields.push('current_level');
        if (!profile.weeklyHours)
            missingFields.push('weekly_hours');
        if (!profile.learningStyle)
            missingFields.push('learning_style');
        if (missingFields.length > 0) {
            throw new common_1.ConflictException({
                statusCode: 409,
                error: 'PROFILE_INCOMPLETE',
                message: 'Onboarding profile must be completed first.',
                details: missingFields,
            });
        }
        return true;
    }
};
exports.ProfileCompletedGuard = ProfileCompletedGuard;
exports.ProfileCompletedGuard = ProfileCompletedGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProfileCompletedGuard);
//# sourceMappingURL=profile-completed.guard.js.map