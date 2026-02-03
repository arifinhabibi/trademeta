import { Injectable } from '@nestjs/common';
import {
  ExecutionOrderRequest,
  ExecutionOrderResponse,
} from './execution.interfaces';
import { BacktestExecutionAdapter } from './backtest-execution.adapter';

@Injectable()
export class BinanceBacktestExecutionAdapter extends BacktestExecutionAdapter {
  executeOrder(request: ExecutionOrderRequest): ExecutionOrderResponse {
    const response = super.executeOrder(request);
    return {
      ...response,
      exchange: 'binance-backtest',
    };
  }
}
