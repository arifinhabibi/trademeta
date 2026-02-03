import { Injectable } from '@nestjs/common';
import { MarketDataAdapter } from './market-data.interfaces';
import { NormalizedOhlcv } from '../../core/market-data/market-data.types';
import { TradingViewHistoricalDataAdapter } from './tradingview-historical-data.adapter';

@Injectable()
export class TradingViewHistoricalAdapter
  extends TradingViewHistoricalDataAdapter
  implements MarketDataAdapter
{
  private consumer?: (data: NormalizedOhlcv) => void;

  start(onData: (data: NormalizedOhlcv) => void): void {
    this.consumer = onData;
  }

  stop(): void {
    this.consumer = undefined;
  }

  emit(candle: NormalizedOhlcv): void {
    if (!this.consumer) {
      return;
    }
    this.consumer(candle);
  }
}
