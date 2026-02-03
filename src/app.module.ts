import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnalysisAgentModule } from './agents/analysis/analysis.module';
import { ExecutionAgentModule } from './agents/execution/execution.module';
import { MarketDataAgentModule } from './agents/market-data/market-data.module';
import { PerformanceAgentModule } from './agents/performance/performance.module';
import { RiskManagerAgentModule } from './agents/risk-manager/risk-manager.module';
import { StrategyAgentModule } from './agents/strategy/strategy.module';
import { ConfigModule } from './core/config/config.module';
import { EventBusModule } from './core/event-bus/event-bus.module';
import { LoggingModule } from './core/logging/logging.module';
import { SchedulerModule } from './core/scheduler/scheduler.module';

@Module({
  imports: [
    LoggingModule,
    ConfigModule,
    EventBusModule,
    SchedulerModule,
    MarketDataAgentModule,
    AnalysisAgentModule,
    StrategyAgentModule,
    RiskManagerAgentModule,
    ExecutionAgentModule,
    PerformanceAgentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
