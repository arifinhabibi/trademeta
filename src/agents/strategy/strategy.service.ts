import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventBusService } from '../../core/event-bus/event-bus.service';
import { createEvent } from '../../core/events/event.factory';
import {
  AnalysisCompletedPayload,
  EventEnvelope,
  StrategyProposedPayload,
} from '../../core/events/event.types';

@Injectable()
// Single responsibility: strategy council voting + meta-selection before risk review.
export class StrategyAgentService implements OnModuleInit {
  private readonly logger = new Logger(StrategyAgentService.name);

  constructor(private readonly eventBus: EventBusService) {}

  onModuleInit(): void {
    this.eventBus.subscribe<AnalysisCompletedPayload>('analysis.completed', (event) =>
      this.handleAnalysis(event),
    );
  }

  private handleAnalysis(event: EventEnvelope<AnalysisCompletedPayload>): void {
    const { symbol, tick, indicators } = event.payload;
    const councilVotes = [
      { strategyId: 'mean-reversion', score: 0.55 + indicators.momentum * 0.001 },
      { strategyId: 'trend-follow', score: 0.62 + indicators.movingAverage * 0.00001 },
      { strategyId: 'breakout', score: 0.58 + indicators.volatility },
    ];

    const selected = councilVotes.reduce((best, current) =>
      current.score > best.score ? current : best,
    );

    const payload: StrategyProposedPayload = {
      symbol,
      tick,
      strategyId: selected.strategyId,
      side: indicators.momentum >= 0 ? 'buy' : 'sell',
      quantity: 10,
      rationale: 'Deterministic council vote with meta-selection.',
      councilVotes,
    };

    const strategyEvent = createEvent('strategy.proposed', payload, event.correlationId);
    this.logger.log(`Strategy proposed by ${payload.strategyId} for tick ${tick}`);
    void this.eventBus.publish(strategyEvent);
  }
}
