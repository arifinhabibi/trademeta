import { Module } from '@nestjs/common';
import { EventBusModule } from '../../core/event-bus/event-bus.module';
import { ExchangeModule } from '../../exchange/exchange.module';
import { ExecutionAgentService } from './execution.service';

@Module({
  imports: [EventBusModule, ExchangeModule],
  providers: [ExecutionAgentService],
})
export class ExecutionAgentModule {}
