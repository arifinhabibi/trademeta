# AI Trading Ecosystem (NestJS, Event-Driven, Modular Monolith)

## Architecture summary
This repository implements a modular monolith that is microservice-ready and strictly event-driven. Agents are isolated NestJS modules that communicate only through an event bus abstraction (Redis Streams-ready), ensuring replayable, deterministic workflows with no direct service-to-service calls.

## Folder structure
```
src/
  agents/
    analysis/
    execution/
    market-data/
    performance/
    risk-manager/
    strategy/
  core/
    config/
    event-bus/
    events/
    logging/
    scheduler/
  exchange/
    exchange.interfaces.ts
    simulated-exchange.adapter.ts
  app.controller.ts
  app.module.ts
  app.service.ts
```

## Core event schemas
Event schemas are explicit, versionable, and replayable through the event bus.

```ts
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
```

## Event emission & consumption
The event bus exposes publish/subscribe/replay operations to keep every agent stateless and replayable.

```ts
export interface EventBus {
  publish<TPayload>(event: EventEnvelope<TPayload>): Promise<void>;
  subscribe<TPayload>(type: EventType, handler: EventHandler<TPayload>): void;
  replay<TPayload>(type: EventType, fromIndex: number, handler: EventHandler<TPayload>): void;
}
```

## Risk approval flow (mandatory gating)
1. StrategyAgent emits `strategy.proposed`.
2. RiskManagerAgent validates kill-switches, exposure, drawdown, and circuit breakers.
3. RiskManagerAgent emits `risk.approved` or `risk.rejected`.
4. ExecutionAgent consumes only `risk.approved`.

## One full trade cycle (market data → execution → evaluation)
1. MarketDataAgent emits `market-data.received` on schedule.
2. AnalysisAgent emits `analysis.completed` with indicators.
3. StrategyAgent emits `strategy.proposed` with council votes and selection.
4. RiskManagerAgent emits `risk.approved` or `risk.rejected`.
5. ExecutionAgent emits `execution.order-executed` (deterministic adapter).
6. PerformanceAgent emits `performance.evaluated` for reflection only.

## Determinism and LLM boundaries
- Execution logic is deterministic and does not use LLMs.
- Any advisory components must emit suggestions only; no agent bypasses RiskManagerAgent.
- Exchange credentials live only in ExecutionAgent.
