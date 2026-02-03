import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EXECUTION_ADAPTER } from '../../adapters/adapter.tokens';
import { ExecutionAdapter } from '../../adapters/execution/execution.interfaces';
import { EventBusService } from '../../core/event-bus/event-bus.service';
import { createEvent } from '../../core/events/event.factory';
import {
  EventEnvelope,
  OrderExecutedPayload,
  RiskApprovedPayload,
} from '../../core/events/event.types';

@Injectable()
// Single responsibility: exchange adapter execution only after risk approval.
export class ExecutionAgentService implements OnModuleInit {
  private readonly logger = new Logger(ExecutionAgentService.name);

  constructor(
    private readonly eventBus: EventBusService,
    @Inject(EXECUTION_ADAPTER) private readonly executionAdapter: ExecutionAdapter,
  ) {}

  onModuleInit(): void {
    this.eventBus.subscribe<RiskApprovedPayload>('risk.approved', (event) => this.handleApproval(event));
  }

  private handleApproval(event: EventEnvelope<RiskApprovedPayload>): void {
    const { symbol, tick, strategyId, side, quantity, maxSlippageBps } = event.payload;
    const execution = this.executionAdapter.executeOrder({
      symbol,
      side,
      quantity,
      maxSlippageBps,
    });

    this.logger.log(`Executed order via ${execution.exchange} for ${symbol}`);

    const payload: OrderExecutedPayload = {
      symbol,
      tick,
      strategyId,
      side,
      quantity,
      executionPrice: execution.executionPrice,
      exchange: execution.exchange,
      orderId: execution.orderId,
    };

    const eventOut = createEvent('execution.order-executed', payload, event.correlationId);
    void this.eventBus.publish(eventOut);
  }
}
