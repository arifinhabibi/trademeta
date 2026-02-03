import { Module } from '@nestjs/common';
import { EventBusModule } from '../../core/event-bus/event-bus.module';
import { PerformanceAgentService } from './performance.service';

@Module({
  imports: [EventBusModule],
  providers: [PerformanceAgentService],
})
export class PerformanceAgentModule {}
