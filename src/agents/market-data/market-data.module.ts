import { Module } from '@nestjs/common';
import { AdaptersModule } from '../../adapters/adapters.module';
import { EventBusModule } from '../../core/event-bus/event-bus.module';
import { MarketDataAgentService } from './market-data.service';

@Module({
  imports: [AdaptersModule, EventBusModule],
  providers: [MarketDataAgentService],
})
export class MarketDataAgentModule {}
