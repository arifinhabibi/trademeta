export interface ExecutionOrderRequest {
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  maxSlippageBps: number;
}

export interface ExecutionOrderResponse {
  orderId: string;
  executionPrice: number;
  exchange: string;
}

export interface ExecutionAdapter {
  executeOrder(request: ExecutionOrderRequest): ExecutionOrderResponse;
}
