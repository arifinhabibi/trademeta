import { Injectable } from '@nestjs/common';
import {
  ActiveTradingSecrets,
  SecretProvider,
  TradingSecrets,
} from './secret-provider.interfaces';

@Injectable()
export class SecretProviderService implements SecretProvider {
  // Secrets are kept only in memory and separated by inactive vs active lifecycle.
  private inactiveSecrets?: TradingSecrets;
  private activeSecrets?: ActiveTradingSecrets;

  inject(secrets: TradingSecrets): void {
    this.inactiveSecrets = { ...secrets };
    this.activeSecrets = undefined;
  }

  activate(): ActiveTradingSecrets {
    if (!this.inactiveSecrets) {
      throw new Error('No inactive secrets available for activation.');
    }

    this.activeSecrets = {
      ...this.inactiveSecrets,
      activatedAt: new Date().toISOString(),
    };
    this.inactiveSecrets = undefined;
    return this.activeSecrets;
  }

  deactivate(): void {
    this.activeSecrets = undefined;
    this.inactiveSecrets = undefined;
  }

  getActiveSecrets(): ActiveTradingSecrets {
    if (!this.activeSecrets) {
      throw new Error('Active secrets are not available.');
    }
    return this.activeSecrets;
  }

  getTradingViewToken(): string {
    if (this.inactiveSecrets?.tradingViewToken) {
      return this.inactiveSecrets.tradingViewToken;
    }
    if (this.activeSecrets?.tradingViewToken) {
      return this.activeSecrets.tradingViewToken;
    }
    throw new Error('TradingView token is not available.');
  }

  hasActiveSecrets(): boolean {
    return Boolean(this.activeSecrets);
  }
}
