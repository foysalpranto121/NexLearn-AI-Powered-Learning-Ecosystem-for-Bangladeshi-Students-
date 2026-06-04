import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './shared/redis.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { AiOrchestratorModule } from './shared/ai-orchestrator/ai-orchestrator.module';
import { AiTutorModule } from './ai-tutor/ai-tutor.module';
import { RoadmapModule } from './roadmap/roadmap.module';
import { GoalsModule } from './goals/goals.module';
import { CodingModule } from './coding/coding.module';
import { NotesModule } from './notes/notes.module';
import { CollaborationModule } from './collaboration/collaboration.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { GamificationModule } from './gamification/gamification.module';
import { ProductivityModule } from './productivity/productivity.module';
import { HackathonModule } from './hackathon/hackathon.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RedisModule,
    AuthModule,
    ProfileModule,
    AiOrchestratorModule,
    AiTutorModule,
    RoadmapModule,
    GoalsModule,
    CodingModule,
    NotesModule,
    CollaborationModule,
    AnalyticsModule,
    GamificationModule,
    ProductivityModule,
    HackathonModule,
  ],
})
export class AppModule {}

