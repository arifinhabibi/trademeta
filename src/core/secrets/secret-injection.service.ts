import { Injectable, Logger } from '@nestjs/common';
import { EventBusService } from '../event-bus/event-bus.service';
import { createEvent } from '../events/event.factory';
import { ConfigService } from '../config/config.service';
import { SecretProviderService } from './secret-provider.service';
import { TradingSecrets } from './secret-provider.interfaces';

@Injectable()
export class SecretInjectionService {
  private readonly logger = new Logger(SecretInjectionService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly eventBus: EventBusService,
    private readonly secretProvider: SecretProviderService,
  ) {}

  async requireRuntimeSecrets(): Promise<void> {
    if (this.configService.tradingMode === 'BACKTEST') {
      return;
    }

    try {
      const secrets = await this.readSecretsFromStdin();
      this.secretProvider.inject(secrets);
      if (this.configService.tradingMode === 'LIVE') {
        this.secretProvider.activate();
        this.logger.log('Live secrets injected and activated.');
      } else {
        this.logger.log('Paper secrets injected and held inactive.');
      }
    } catch (error) {
      // Kill-switch event ensures downstream risk controls halt if secrets are missing.
      const payload = {
        scope: 'global' as const,
        reason: 'Secret injection failed. Trading is halted.',
      };
      const killSwitchEvent = createEvent('risk.kill-switch', payload);
      void this.eventBus.publish(killSwitchEvent);
      throw error;
    }
  }

  private readSecretsFromStdin(): Promise<TradingSecrets> {
    return new Promise((resolve, reject) => {
      let data = '';
      if (process.stdin.isTTY) {
        reject(new Error('Secrets must be piped via stdin in non-backtest modes.'));
        return;
      }
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', (chunk) => {
        data += chunk;
      });
      process.stdin.on('end', () => {
        if (!data.trim()) {
          reject(new Error('No secrets provided via stdin.'));
          return;
        }
        try {
          const parsed = JSON.parse(data) as TradingSecrets;
          if (!parsed.binanceApiKey || !parsed.binanceApiSecret || !parsed.tradingViewToken) {
            reject(new Error('Incomplete secrets payload.'));
            return;
          }
          resolve(parsed);
        } catch (err) {
          reject(err);
        }
      });
      process.stdin.on('error', (err) => reject(err));
    });
  }
}
