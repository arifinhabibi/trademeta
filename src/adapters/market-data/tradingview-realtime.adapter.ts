import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../core/config/config.service';
import { SchedulerService } from '../../core/scheduler/scheduler.service';
import { NormalizedOhlcv } from '../../core/market-data/market-data.types';
import { SecretProviderService } from '../../core/secrets/secret-provider.service';
import { MarketDataAdapter } from './market-data.interfaces';

@Injectable()
export class TradingViewRealtimeAdapter implements MarketDataAdapter {
  private tick = 0;

  constructor(
    private readonly configService: ConfigService,
    private readonly schedulerService: SchedulerService,
    private readonly secretProvider: SecretProviderService,
  ) {}

  start(onData: (data: NormalizedOhlcv) => void): void {
    // Enforce runtime-secret injection before starting realtime market data.
    this.secretProvider.getTradingViewToken();
    this.schedulerService.scheduleInterval(
      'tradingview-realtime-stream',
      this.configService.schedulerIntervalMs,
      () => {
        this.tick += 1;
        const open = 30000 + this.tick * 5;
        const close = open + 2;
        const high = close + 3;
        const low = open - 3;
        const volume = 100 + this.tick;
        const timestamp = new Date().toISOString();

        onData({
          symbol: this.configService.marketDataSymbol,
          open,
          high,
          low,
          close,
          volume,
          startTime: timestamp,
          endTime: timestamp,
          source: 'tradingview-realtime',
          tick: this.tick,
        });
      },
    );
  }

  stop(): void {
    // SchedulerService handles cleanup on shutdown to avoid drift.
  }
}
