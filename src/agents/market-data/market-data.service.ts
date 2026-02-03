import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '../../core/config/config.service';
import { SchedulerService } from '../../core/scheduler/scheduler.service';
import { EventBusService } from '../../core/event-bus/event-bus.service';
import { createEvent } from '../../core/events/event.factory';
import { MarketDataReceivedPayload } from '../../core/events/event.types';

@Injectable()
// Single responsibility: source market data and publish immutable events.
export class MarketDataAgentService implements OnModuleInit {
  private readonly logger = new Logger(MarketDataAgentService.name);
  private tick = 0;

  constructor(
    private readonly configService: ConfigService,
    private readonly schedulerService: SchedulerService,
    private readonly eventBus: EventBusService,
  ) {}

  onModuleInit(): void {
    this.schedulerService.scheduleInterval(
      'market-data-publish',
      this.configService.schedulerIntervalMs,
      () => this.publishTick(),
    );
  }

  private publishTick(): void {
    this.tick += 1;
    const payload: MarketDataReceivedPayload = {
      symbol: this.configService.marketDataSymbol,
      price: 30000 + this.tick * 5,
      volume: 100 + this.tick,
      source: this.configService.marketDataSource,
      tick: this.tick,
    };

    const event = createEvent('market-data.received', payload);
    this.logger.log(`Publishing market data tick ${this.tick}`);
    void this.eventBus.publish(event);
  }
}
