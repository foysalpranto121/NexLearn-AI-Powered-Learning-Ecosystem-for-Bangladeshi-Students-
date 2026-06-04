import { Module } from '@nestjs/common';
import { RoadmapService } from './roadmap.service';
import { RoadmapController } from './roadmap.controller';
import { GamificationModule } from '../gamification/gamification.module';

@Module({
  imports: [GamificationModule],
  providers: [RoadmapService],
  controllers: [RoadmapController],
  exports: [RoadmapService],
})
export class RoadmapModule {}

