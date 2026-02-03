import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '../../core/config/config.service';
import { TradingViewHistoricalAdapter } from '../market-data/tradingview-historical.adapter';

@Injectable()
export class BacktestOrchestrator implements OnApplicationBootstrap {
  private readonly logger = new Logger(BacktestOrchestrator.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly historicalAdapter: TradingViewHistoricalAdapter,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if (this.configService.tradingMode !== 'BACKTEST') {
      return;
    }

    const series = this.historicalAdapter.getHistoricalSeries();

    for (const candle of series) {
      // Emit only the current candle to prevent look-ahead bias.
      this.historicalAdapter.emit(candle);
    }

    this.logger.log(`Backtest replay complete for ${series.length} candles.`);
  }
}
