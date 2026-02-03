import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { MARKET_DATA_ADAPTER } from '../../adapters/adapter.tokens';
import { MarketDataAdapter } from '../../adapters/market-data/market-data.interfaces';
import { EventBusService } from '../../core/event-bus/event-bus.service';
import { createEvent } from '../../core/events/event.factory';
import { MarketDataReceivedPayload } from '../../core/events/event.types';
import { NormalizedOhlcv } from '../../core/market-data/market-data.types';

@Injectable()
// Single responsibility: source market data and publish immutable events.
export class MarketDataAgentService implements OnModuleInit {
  private readonly logger = new Logger(MarketDataAgentService.name);

  constructor(
    private readonly eventBus: EventBusService,
    @Inject(MARKET_DATA_ADAPTER) private readonly adapter: MarketDataAdapter,
  ) {}

  onModuleInit(): void {
    this.adapter.start((data) => this.publishOhlcv(data));
  }

  private publishOhlcv(data: NormalizedOhlcv): void {
    const payload: MarketDataReceivedPayload = {
      symbol: data.symbol,
      price: data.close,
      volume: data.volume,
      source: data.source,
      tick: data.tick,
      ohlcv: data,
    };

    const event = createEvent('market-data.received', payload);
    this.logger.log(`Publishing market data tick ${data.tick}`);
    void this.eventBus.publish(event);
  }
}
