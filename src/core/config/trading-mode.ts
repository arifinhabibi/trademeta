export const TRADING_MODES = ['BACKTEST', 'PAPER', 'LIVE'] as const;

export type TradingMode = (typeof TRADING_MODES)[number];

export const isTradingMode = (value: string): value is TradingMode =>
  TRADING_MODES.includes(value as TradingMode);

export const parseTradingMode = (value?: string): TradingMode => {
  const normalized = (value ?? 'PAPER').toUpperCase();
  if (!isTradingMode(normalized)) {
    throw new Error(
      `Invalid TRADING_MODE "${value ?? ''}". Expected one of ${TRADING_MODES.join(', ')}.`,
    );
  }
  return normalized;
};
