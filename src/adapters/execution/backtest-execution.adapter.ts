import { Injectable } from '@nestjs/common';
import {
  ExecutionAdapter,
  ExecutionOrderRequest,
  ExecutionOrderResponse,
} from './execution.interfaces';

@Injectable()
export class BacktestExecutionAdapter implements ExecutionAdapter {
  private orderSequence = 0;

  protected deterministicPrice(request: ExecutionOrderRequest): number {
    const base = 30000;
    return request.side === 'buy' ? base + 1 : base - 1;
  }

  executeOrder(request: ExecutionOrderRequest): ExecutionOrderResponse {
    // Deterministic sequence avoids non-replayable backtests.
    this.orderSequence += 1;
    return {
      orderId: `BACKTEST-${request.symbol}-${request.side}-${this.orderSequence}`,
      executionPrice: this.deterministicPrice(request),
      exchange: 'binance-backtest',
    };
  }
}
