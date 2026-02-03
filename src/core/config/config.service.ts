import { Injectable } from '@nestjs/common';
import { parseTradingMode, TradingMode } from './trading-mode';

@Injectable()
export class ConfigService {
  get tradingMode(): TradingMode {
    return parseTradingMode(process.env.TRADING_MODE);
  }

  get marketDataSymbol(): string {
    return process.env.MARKET_DATA_SYMBOL ?? 'BTC-USD';
  }

  get marketDataSource(): string {
    return process.env.MARKET_DATA_SOURCE ?? 'simulator';
  }

  get schedulerIntervalMs(): number {
    return Number(process.env.SCHEDULER_INTERVAL_MS ?? 2000);
  }

  get backtestMaxTicks(): number {
    return Number(process.env.BACKTEST_MAX_TICKS ?? 120);
  }

  get riskMaxExposure(): number {
    return Number(process.env.RISK_MAX_EXPOSURE ?? 100);
  }

  get riskMaxDrawdown(): number {
    return Number(process.env.RISK_MAX_DRAWDOWN ?? 0.2);
  }

  get riskCircuitBreakerBps(): number {
    return Number(process.env.RISK_CIRCUIT_BREAKER_BPS ?? 150);
  }
}
