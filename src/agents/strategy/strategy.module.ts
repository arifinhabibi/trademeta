import { Module } from '@nestjs/common';
import { EventBusModule } from '../../core/event-bus/event-bus.module';
import { StrategyAgentService } from './strategy.service';

@Module({
  imports: [EventBusModule],
  providers: [StrategyAgentService],
})
export class StrategyAgentModule {}
