import { Module } from '@nestjs/common';
import { ProductivityService } from './productivity.service';
import { ProductivityController } from './productivity.controller';
import { GamificationModule } from '../gamification/gamification.module';

@Module({
  imports: [GamificationModule],
  controllers: [ProductivityController],
  providers: [ProductivityService],
  exports: [ProductivityService],
})
export class ProductivityModule {}
