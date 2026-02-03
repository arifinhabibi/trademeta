import { EventEnvelope, EventType } from '../events/event.types';

export type EventHandler<TPayload> = (event: EventEnvelope<TPayload>) => void;

export interface EventBus {
  publish<TPayload>(event: EventEnvelope<TPayload>): Promise<void>;
  subscribe<TPayload>(type: EventType, handler: EventHandler<TPayload>): void;
  replay<TPayload>(type: EventType, fromIndex: number, handler: EventHandler<TPayload>): void;
}
