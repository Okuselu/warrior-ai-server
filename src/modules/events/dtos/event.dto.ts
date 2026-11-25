import type { EventEnvelope } from "../../../common/types";

/** Wire contract §7: JSON event envelope, snake_case keys, idempotent by event_id. */
export type IngestEventRequestDTO = EventEnvelope<Record<string, unknown>>;

export interface IngestEventResponseDTO {
  eventId: string;
  accepted: boolean;
}
