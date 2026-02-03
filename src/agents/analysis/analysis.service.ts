import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventBusService } from '../../core/event-bus/event-bus.service';
import { createEvent } from '../../core/events/event.factory';
import {
  AnalysisCompletedPayload,
  EventEnvelope,
  MarketDataReceivedPayload,
} from '../../core/events/event.types';

@Injectable()
// Single responsibility: deterministic analysis for downstream advisory input.
export class AnalysisAgentService implements OnModuleInit {
  private readonly logger = new Logger(AnalysisAgentService.name);

  constructor(private readonly eventBus: EventBusService) {}

  onModuleInit(): void {
    this.eventBus.subscribe<MarketDataReceivedPayload>('market-data.received', (event) =>
      this.handleMarketData(event),
    );
  }

  private handleMarketData(event: EventEnvelope<MarketDataReceivedPayload>): void {
    const { price, tick, symbol } = event.payload;
    const indicators = {
      movingAverage: price - 10,
      momentum: price - (30000 + (tick - 1) * 5),
      volatility: 0.02,
    };

    const payload: AnalysisCompletedPayload = {
      symbol,
      tick,
      indicators,
      confidence: 0.76,
    };

    const analysisEvent = createEvent('analysis.completed', payload, event.correlationId);
    this.logger.log(`Analysis completed for tick ${tick}`);
    void this.eventBus.publish(analysisEvent);
  }
}
