import { Module } from '@nestjs/common';
import { CodingService } from './coding.service';
import { CodingController } from './coding.controller';
import { GamificationModule } from '../gamification/gamification.module';

@Module({
  imports: [GamificationModule],
  providers: [CodingService],
  controllers: [CodingController],
  exports: [CodingService],
})
export class CodingModule {}

