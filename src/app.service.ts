import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus(): string {
    return 'AI trading ecosystem online. Event-driven agents are active.';
  }
}
