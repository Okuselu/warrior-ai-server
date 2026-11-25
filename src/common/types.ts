import type { EventType } from "./constants";

export type UUID = string;
export type ISODate = string;

/** Envelope used by the offline-first app for idempotent event sync (data contract §7). */
export interface EventEnvelope<TPayload = Record<string, unknown>> {
  event_id: UUID;
  event_type: EventType;
  schema_version: string;
  occurred_at: ISODate;
  patient_id?: UUID;
  payload: TPayload;
}

export interface PageQuery {
  limit?: number;
  offset?: number;
}

export interface Paged<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}
