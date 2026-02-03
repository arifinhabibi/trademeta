import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '../../core/config/config.service';
import { EventBusService } from '../../core/event-bus/event-bus.service';
import { EventEnvelope, PerformanceEvaluatedPayload } from '../../core/events/event.types';

@Injectable()
export class BacktestEvaluator implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(BacktestEvaluator.name);
  private totalPnl = 0;
  private totalTrades = 0;

  constructor(
    private readonly configService: ConfigService,
    private readonly eventBus: EventBusService,
  ) {}

  onModuleInit(): void {
    if (this.configService.tradingMode !== 'BACKTEST') {
      return;
    }

    this.eventBus.subscribe<PerformanceEvaluatedPayload>('performance.evaluated', (event) =>
      this.handlePerformance(event),
    );
  }

  onModuleDestroy(): void {
    if (this.configService.tradingMode !== 'BACKTEST') {
      return;
    }

    this.logger.log(
      `Backtest summary: trades=${this.totalTrades}, totalPnl=${this.totalPnl.toFixed(4)}`,
    );
  }

  private handlePerformance(event: EventEnvelope<PerformanceEvaluatedPayload>): void {
    this.totalTrades += 1;
    this.totalPnl += event.payload.pnl;
  }
}
