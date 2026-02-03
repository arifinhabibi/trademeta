import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventBusService } from '../../core/event-bus/event-bus.service';
import { createEvent } from '../../core/events/event.factory';
import {
  EventEnvelope,
  OrderExecutedPayload,
  PerformanceEvaluatedPayload,
} from '../../core/events/event.types';

@Injectable()
// Single responsibility: post-trade evaluation and reflection only.
export class PerformanceAgentService implements OnModuleInit {
  private readonly logger = new Logger(PerformanceAgentService.name);

  constructor(private readonly eventBus: EventBusService) {}

  onModuleInit(): void {
    this.eventBus.subscribe<OrderExecutedPayload>('execution.order-executed', (event) =>
      this.handleExecution(event),
    );
  }

  private handleExecution(event: EventEnvelope<OrderExecutedPayload>): void {
    const { symbol, tick, strategyId, executionPrice, quantity } = event.payload;
    const pnl = executionPrice * quantity * 0.0005;

    const payload: PerformanceEvaluatedPayload = {
      symbol,
      tick,
      strategyId,
      pnl,
      notes: 'Deterministic post-trade evaluation for feedback loops only.',
    };

    const perfEvent = createEvent('performance.evaluated', payload, event.correlationId);
    this.logger.log(`Performance evaluated for ${strategyId} tick ${tick}`);
    void this.eventBus.publish(perfEvent);
  }
}
