import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../core/config/config.service';
import { NormalizedOhlcv } from '../../core/market-data/market-data.types';

@Injectable()
export class TradingViewHistoricalDataAdapter {
  constructor(private readonly configService: ConfigService) {}

  getHistoricalSeries(): NormalizedOhlcv[] {
    const ticks = this.configService.backtestMaxTicks;
    const startTimestamp = Date.UTC(2023, 0, 1, 0, 0, 0);

    return Array.from({ length: ticks }, (_, index) => {
      const tick = index + 1;
      const open = 30000 + tick * 5;
      const close = open + 2;
      const high = close + 3;
      const low = open - 3;
      const volume = 100 + tick;
      const startTime = new Date(startTimestamp + index * 60_000).toISOString();
      const endTime = new Date(startTimestamp + (index + 1) * 60_000).toISOString();

      return {
        symbol: this.configService.marketDataSymbol,
        open,
        high,
        low,
        close,
        volume,
        startTime,
        endTime,
        source: 'tradingview-historical',
        tick,
      };
    });
  }
}
