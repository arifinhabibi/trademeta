import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '../../core/config/config.service';
import { EventBusService } from '../../core/event-bus/event-bus.service';
import { createEvent } from '../../core/events/event.factory';
import {
  EventEnvelope,
  RiskApprovedPayload,
  RiskRejectedPayload,
  RiskKillSwitchPayload,
  StrategyProposedPayload,
} from '../../core/events/event.types';

@Injectable()
// Single responsibility: enforce risk constraints and kill-switches, no execution allowed.
export class RiskManagerAgentService implements OnModuleInit {
  private readonly logger = new Logger(RiskManagerAgentService.name);
  private globalKillSwitch = false;
  private readonly strategyKillSwitch = new Set<string>();
  private readonly currentDrawdown = 0.05;

  constructor(
    private readonly configService: ConfigService,
    private readonly eventBus: EventBusService,
  ) {}

  onModuleInit(): void {
    this.eventBus.subscribe<StrategyProposedPayload>('strategy.proposed', (event) =>
      this.handleStrategy(event),
    );
  }

  private handleStrategy(event: EventEnvelope<StrategyProposedPayload>): void {
    const { symbol, tick, strategyId, quantity, side } = event.payload;
    const breachedLimits: string[] = [];

    if (this.globalKillSwitch) {
      breachedLimits.push('global-kill-switch');
    }

    if (this.strategyKillSwitch.has(strategyId)) {
      breachedLimits.push(`strategy-kill-switch:${strategyId}`);
    }

    if (quantity > this.configService.riskMaxExposure) {
      breachedLimits.push('max-exposure');
    }

    if (this.currentDrawdown >= this.configService.riskMaxDrawdown) {
      breachedLimits.push('max-drawdown');
    }

    if (breachedLimits.length > 0) {
      const payload: RiskRejectedPayload = {
        symbol,
        tick,
        strategyId,
        reason: 'Risk constraints breached',
        breachedLimits,
      };
      const rejectionEvent = createEvent('risk.rejected', payload, event.correlationId);
      this.logger.warn(`Risk rejected for ${strategyId} tick ${tick}`);
      void this.eventBus.publish(rejectionEvent);
      return;
    }

    const payload: RiskApprovedPayload = {
      symbol,
      tick,
      strategyId,
      side,
      quantity,
      maxSlippageBps: this.configService.riskCircuitBreakerBps,
      riskChecks: ['exposure', 'drawdown', 'kill-switch'],
    };

    const approvalEvent = createEvent('risk.approved', payload, event.correlationId);
    this.logger.log(`Risk approved for ${strategyId} tick ${tick}`);
    void this.eventBus.publish(approvalEvent);
  }

  triggerGlobalKillSwitch(reason: string): void {
    this.globalKillSwitch = true;
    const payload: RiskKillSwitchPayload = { scope: 'global', reason };
    const event = createEvent('risk.kill-switch', payload);
    void this.eventBus.publish(event);
  }

  triggerStrategyKillSwitch(strategyId: string, reason: string): void {
    this.strategyKillSwitch.add(strategyId);
    const payload: RiskKillSwitchPayload = { scope: 'strategy', strategyId, reason };
    const event = createEvent('risk.kill-switch', payload);
    void this.eventBus.publish(event);
  }
}
