export interface NormalizedOhlcv {
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  startTime: string;
  endTime: string;
  source: string;
  tick: number;
}
