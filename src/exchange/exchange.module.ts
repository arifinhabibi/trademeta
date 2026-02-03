import { Module } from '@nestjs/common';
import { SimulatedExchangeAdapter } from './simulated-exchange.adapter';

@Module({
  providers: [SimulatedExchangeAdapter],
  exports: [SimulatedExchangeAdapter],
})
export class ExchangeModule {}
