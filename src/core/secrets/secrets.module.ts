import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { EventBusModule } from '../event-bus/event-bus.module';
import { SecretInjectionService } from './secret-injection.service';
import { SecretProviderService } from './secret-provider.service';

@Module({
  imports: [ConfigModule, EventBusModule],
  providers: [SecretProviderService, SecretInjectionService],
  exports: [SecretProviderService, SecretInjectionService],
})
export class SecretsModule {}
