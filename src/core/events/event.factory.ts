import { randomUUID } from 'crypto';
import { EventEnvelope, EventType } from './event.types';

export const createEvent = <TPayload>(
  type: EventType,
  payload: TPayload,
  correlationId?: string,
): EventEnvelope<TPayload> => ({
  id: randomUUID(),
  type,
  timestamp: new Date().toISOString(),
  correlationId: correlationId ?? randomUUID(),
  payload,
});
