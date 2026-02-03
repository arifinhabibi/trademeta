import { Injectable } from '@nestjs/common';
import { ExchangeAdapter, ExchangeOrderRequest, ExchangeOrderResponse } from './exchange.interfaces';

@Injectable()
export class SimulatedExchangeAdapter implements ExchangeAdapter {
  executeOrder(request: ExchangeOrderRequest): ExchangeOrderResponse {
    return {
      orderId: `SIM-${request.symbol}-${Date.now()}`,
      executionPrice: 30000,
      exchange: 'simulated',
    };
  }
}
