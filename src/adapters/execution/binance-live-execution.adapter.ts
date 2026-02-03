import { Injectable } from '@nestjs/common';
import {
  ExecutionAdapter,
  ExecutionOrderRequest,
  ExecutionOrderResponse,
} from './execution.interfaces';
import { SecretProviderService } from '../../core/secrets/secret-provider.service';

@Injectable()
export class BinanceLiveExecutionAdapter implements ExecutionAdapter {
  constructor(private readonly secretProvider: SecretProviderService) {}

  executeOrder(request: ExecutionOrderRequest): ExecutionOrderResponse {
    // Live execution requires active secrets to enforce runtime injection.
    this.secretProvider.getActiveSecrets();

    return {
      orderId: `LIVE-${request.symbol}-${request.side}-${Date.now()}`,
      executionPrice: 30000,
      exchange: 'binance-live',
    };
  }
}
