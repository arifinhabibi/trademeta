export interface ExchangeOrderRequest {
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  maxSlippageBps: number;
}

export interface ExchangeOrderResponse {
  orderId: string;
  executionPrice: number;
  exchange: string;
}

export interface ExchangeAdapter {
  executeOrder(request: ExchangeOrderRequest): ExchangeOrderResponse;
}
