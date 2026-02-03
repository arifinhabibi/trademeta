import { Module } from '@nestjs/common';
import { EventBusModule } from '../../core/event-bus/event-bus.module';
import { AnalysisAgentService } from './analysis.service';

@Module({
  imports: [EventBusModule],
  providers: [AnalysisAgentService],
})
export class AnalysisAgentModule {}
