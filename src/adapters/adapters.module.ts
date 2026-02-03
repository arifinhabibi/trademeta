import { Module } from '@nestjs/common';
import { ConfigModule } from '../core/config/config.module';
import { ConfigService } from '../core/config/config.service';
import { SchedulerModule } from '../core/scheduler/scheduler.module';
import { SecretsModule } from '../core/secrets/secrets.module';
import { EXECUTION_ADAPTER, MARKET_DATA_ADAPTER } from './adapter.tokens';
import { BacktestEvaluator } from './backtest/backtest.evaluator';
import { BacktestOrchestrator } from './backtest/backtest.orchestrator';
import { TradingViewHistoricalDataAdapter } from './market-data/tradingview-historical-data.adapter';
import { TradingViewHistoricalAdapter } from './market-data/tradingview-historical.adapter';
import { TradingViewRealtimeAdapter } from './market-data/tradingview-realtime.adapter';
import { BacktestExecutionAdapter } from './execution/backtest-execution.adapter';
import { BinanceBacktestExecutionAdapter } from './execution/binance-backtest-execution.adapter';
import { BinanceLiveExecutionAdapter } from './execution/binance-live-execution.adapter';
import { BinancePaperExecutionAdapter } from './execution/binance-paper-execution.adapter';

@Module({
  imports: [ConfigModule, SchedulerModule, SecretsModule],
  providers: [
    TradingViewHistoricalDataAdapter,
    TradingViewHistoricalAdapter,
    TradingViewRealtimeAdapter,
    BacktestExecutionAdapter,
    BinanceBacktestExecutionAdapter,
    BinancePaperExecutionAdapter,
    BinanceLiveExecutionAdapter,
    BacktestOrchestrator,
    BacktestEvaluator,
    {
      provide: MARKET_DATA_ADAPTER,
      useFactory: (
        configService: ConfigService,
        historicalAdapter: TradingViewHistoricalAdapter,
        realtimeAdapter: TradingViewRealtimeAdapter,
      ) => {
        // Mode-based resolution lives in adapters to keep agents mode-agnostic.
        if (configService.tradingMode === 'BACKTEST') {
          return historicalAdapter;
        }
        return realtimeAdapter;
      },
      inject: [ConfigService, TradingViewHistoricalAdapter, TradingViewRealtimeAdapter],
    },
    {
      provide: EXECUTION_ADAPTER,
      useFactory: (
        configService: ConfigService,
        backtestAdapter: BinanceBacktestExecutionAdapter,
        paperAdapter: BinancePaperExecutionAdapter,
        liveAdapter: BinanceLiveExecutionAdapter,
      ) => {
        // Execution venue selection is centralized here to avoid agent branching.
        if (configService.tradingMode === 'BACKTEST') {
          return backtestAdapter;
        }
        if (configService.tradingMode === 'PAPER') {
          return paperAdapter;
        }
        return liveAdapter;
      },
      inject: [
        ConfigService,
        BinanceBacktestExecutionAdapter,
        BinancePaperExecutionAdapter,
        BinanceLiveExecutionAdapter,
      ],
    },
  ],
  exports: [MARKET_DATA_ADAPTER, EXECUTION_ADAPTER, BacktestOrchestrator, BacktestEvaluator],
})
export class AdaptersModule {}
