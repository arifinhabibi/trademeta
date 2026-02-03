export interface TradingSecrets {
  binanceApiKey: string;
  binanceApiSecret: string;
  tradingViewToken: string;
}

export interface ActiveTradingSecrets extends TradingSecrets {
  activatedAt: string;
}

export interface SecretProvider {
  inject(secrets: TradingSecrets): void;
  activate(): ActiveTradingSecrets;
  deactivate(): void;
  getActiveSecrets(): ActiveTradingSecrets;
  getTradingViewToken(): string;
  hasActiveSecrets(): boolean;
}
