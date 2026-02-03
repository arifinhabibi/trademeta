import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventBusService } from '../../core/event-bus/event-bus.service';
import { createEvent } from '../../core/events/event.factory';
import {
  EventEnvelope,
  OrderExecutedPayload,
  RiskApprovedPayload,
} from '../../core/events/event.types';
import { SimulatedExchangeAdapter } from '../../exchange/simulated-exchange.adapter';

@Injectable()
// Single responsibility: exchange adapter execution only after risk approval.
export class ExecutionAgentService implements OnModuleInit {
  private readonly logger = new Logger(ExecutionAgentService.name);
  private readonly exchangeApiKey = process.env.EXCHANGE_API_KEY ?? 'local-sim-key';

  constructor(
    private readonly eventBus: EventBusService,
    private readonly exchangeAdapter: SimulatedExchangeAdapter,
  ) {}

  onModuleInit(): void {
    this.eventBus.subscribe<RiskApprovedPayload>('risk.approved', (event) => this.handleApproval(event));
  }

  private handleApproval(event: EventEnvelope<RiskApprovedPayload>): void {
    const { symbol, tick, strategyId, side, quantity, maxSlippageBps } = event.payload;
    const execution = this.exchangeAdapter.executeOrder({
      symbol,
      side,
      quantity,
      maxSlippageBps,
    });

    this.logger.log(`Executed order via ${execution.exchange} for ${symbol} using key ${this.exchangeApiKey}`);

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
