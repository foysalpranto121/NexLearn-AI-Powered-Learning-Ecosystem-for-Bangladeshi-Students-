"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const redis_module_1 = require("./shared/redis.module");
const auth_module_1 = require("./auth/auth.module");
const profile_module_1 = require("./profile/profile.module");
const ai_orchestrator_module_1 = require("./shared/ai-orchestrator/ai-orchestrator.module");
const ai_tutor_module_1 = require("./ai-tutor/ai-tutor.module");
const roadmap_module_1 = require("./roadmap/roadmap.module");
const goals_module_1 = require("./goals/goals.module");
const coding_module_1 = require("./coding/coding.module");
const notes_module_1 = require("./notes/notes.module");
const collaboration_module_1 = require("./collaboration/collaboration.module");
const analytics_module_1 = require("./analytics/analytics.module");
const gamification_module_1 = require("./gamification/gamification.module");
const productivity_module_1 = require("./productivity/productivity.module");
const hackathon_module_1 = require("./hackathon/hackathon.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule,
            redis_module_1.RedisModule,
            auth_module_1.AuthModule,
            profile_module_1.ProfileModule,
            ai_orchestrator_module_1.AiOrchestratorModule,
            ai_tutor_module_1.AiTutorModule,
            roadmap_module_1.RoadmapModule,
            goals_module_1.GoalsModule,
            coding_module_1.CodingModule,
            notes_module_1.NotesModule,
            collaboration_module_1.CollaborationModule,
            analytics_module_1.AnalyticsModule,
            gamification_module_1.GamificationModule,
            productivity_module_1.ProductivityModule,
            hackathon_module_1.HackathonModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map