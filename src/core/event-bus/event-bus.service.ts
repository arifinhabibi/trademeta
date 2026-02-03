import { Injectable, Logger } from '@nestjs/common';
import { EventBus, EventHandler } from './event-bus.interfaces';
import { EventEnvelope, EventType } from '../events/event.types';

interface EventStream {
  events: EventEnvelope<unknown>[];
  handlers: Array<EventHandler<unknown>>;
}

@Injectable()
export class EventBusService implements EventBus {
  private readonly logger = new Logger(EventBusService.name);
  private readonly streams = new Map<EventType, EventStream>();

  async publish<TPayload>(event: EventEnvelope<TPayload>): Promise<void> {
    const stream = this.ensureStream(event.type);
    stream.events.push(event as EventEnvelope<unknown>);
    this.logger.debug(`Event published: ${event.type} (${event.id})`);
    stream.handlers.forEach((handler) => {
      handler(event as EventEnvelope<unknown>);
    });
  }

  subscribe<TPayload>(type: EventType, handler: EventHandler<TPayload>): void {
    const stream = this.ensureStream(type);
    stream.handlers.push(handler as EventHandler<unknown>);
    this.logger.debug(`Subscribed handler to ${type}`);
  }

  replay<TPayload>(type: EventType, fromIndex: number, handler: EventHandler<TPayload>): void {
    const stream = this.ensureStream(type);
    stream.events.slice(fromIndex).forEach((event) => {
      handler(event as EventEnvelope<TPayload>);
    });
    this.logger.debug(`Replayed ${stream.events.length - fromIndex} events for ${type}`);
  }

  private ensureStream(type: EventType): EventStream {
    if (!this.streams.has(type)) {
      this.streams.set(type, { events: [], handlers: [] });
    }
    return this.streams.get(type) as EventStream;
  }
}
