import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SecretInjectionService } from './core/secrets/secret-injection.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const secretInjectionService = app.get(SecretInjectionService);
  await secretInjectionService.requireRuntimeSecrets();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
