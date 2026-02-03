import { Module } from '@nestjs/common';
import { ConfigModule } from '../../core/config/config.module';
import { EventBusModule } from '../../core/event-bus/event-bus.module';
import { SchedulerModule } from '../../core/scheduler/scheduler.module';
import { MarketDataAgentService } from './market-data.service';

@Module({
  imports: [ConfigModule, EventBusModule, SchedulerModule],
  providers: [MarketDataAgentService],
})
export class MarketDataAgentModule {}
