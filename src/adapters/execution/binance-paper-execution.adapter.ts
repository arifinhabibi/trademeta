import { Injectable } from '@nestjs/common';
import {
  ExecutionAdapter,
  ExecutionOrderRequest,
  ExecutionOrderResponse,
} from './execution.interfaces';

@Injectable()
export class BinancePaperExecutionAdapter implements ExecutionAdapter {
  executeOrder(request: ExecutionOrderRequest): ExecutionOrderResponse {
    return {
      orderId: `PAPER-${request.symbol}-${request.side}-${Date.now()}`,
      executionPrice: 30000,
      exchange: 'binance-paper',
    };
  }
}
