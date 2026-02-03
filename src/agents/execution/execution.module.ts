import { Module } from '@nestjs/common';
import { AdaptersModule } from '../../adapters/adapters.module';
import { EventBusModule } from '../../core/event-bus/event-bus.module';
import { ExecutionAgentService } from './execution.service';

@Module({
  imports: [AdaptersModule, EventBusModule],
  providers: [ExecutionAgentService],
})
export class ExecutionAgentModule {}
