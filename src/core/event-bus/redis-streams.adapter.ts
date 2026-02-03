import { Injectable } from '@nestjs/common';
import { EventEnvelope } from '../events/event.types';

@Injectable()
export class RedisStreamsAdapter {
  // Placeholder adapter for Redis Streams integration.
  // Keeps the interface microservice-ready without direct coupling.
  appendToStream<TPayload>(_stream: string, _event: EventEnvelope<TPayload>): void {
    // Implement Redis XADD here in a deployment environment.
  }
}
