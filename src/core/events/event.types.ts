import { NormalizedOhlcv } from '../market-data/market-data.types';

export type EventType =
  | 'market-data.received'
  | 'analysis.completed'
  | 'strategy.proposed'
  | 'risk.approved'
  | 'risk.rejected'
  | 'risk.kill-switch'
  | 'execution.order-executed'
  | 'performance.evaluated';

export interface EventEnvelope<TPayload> {
  id: string;
  type: EventType;
  timestamp: string;
  correlationId: string;
  payload: TPayload;
}

export interface MarketDataReceivedPayload {
  symbol: string;
  price: number;
  volume: number;
  source: string;
  tick: number;
  ohlcv: NormalizedOhlcv;
}

export interface AnalysisCompletedPayload {
  symbol: string;
  tick: number;
  indicators: Record<string, number>;
  confidence: number;
}

export interface StrategyProposedPayload {
  symbol: string;
  tick: number;
  strategyId: string;
  side: 'buy' | 'sell';
  quantity: number;
  rationale: string;
  councilVotes: Array<{ strategyId: string; score: number }>;
}

export interface RiskApprovedPayload {
  symbol: string;
  tick: number;
  strategyId: string;
  side: 'buy' | 'sell';
  quantity: number;
  maxSlippageBps: number;
  riskChecks: string[];
}

export interface RiskRejectedPayload {
  symbol: string;
  tick: number;
  strategyId: string;
  reason: string;
  breachedLimits: string[];
}

export interface RiskKillSwitchPayload {
  scope: 'global' | 'strategy';
  strategyId?: string;
  reason: string;
}

export interface OrderExecutedPayload {
  symbol: string;
  tick: number;
  strategyId: string;
  side: 'buy' | 'sell';
  quantity: number;
  executionPrice: number;
  exchange: string;
  orderId: string;
}

export interface PerformanceEvaluatedPayload {
  symbol: string;
  tick: number;
  strategyId: string;
  pnl: number;
  notes: string;
}

export type TradingEvent =
  | EventEnvelope<MarketDataReceivedPayload>
  | EventEnvelope<AnalysisCompletedPayload>
  | EventEnvelope<StrategyProposedPayload>
  | EventEnvelope<RiskApprovedPayload>
  | EventEnvelope<RiskRejectedPayload>
  | EventEnvelope<RiskKillSwitchPayload>
  | EventEnvelope<OrderExecutedPayload>
  | EventEnvelope<PerformanceEvaluatedPayload>;
