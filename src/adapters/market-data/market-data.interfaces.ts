import { NormalizedOhlcv } from '../../core/market-data/market-data.types';

export interface MarketDataAdapter {
  start(onData: (data: NormalizedOhlcv) => void): void;
  stop(): void;
}
