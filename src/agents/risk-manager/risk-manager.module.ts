import { Module } from '@nestjs/common';
import { ConfigModule } from '../../core/config/config.module';
import { EventBusModule } from '../../core/event-bus/event-bus.module';
import { RiskManagerAgentService } from './risk-manager.service';

@Module({
  imports: [ConfigModule, EventBusModule],
  providers: [RiskManagerAgentService],
})
export class RiskManagerAgentModule {}
