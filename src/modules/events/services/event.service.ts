import type { RequestContextDTO } from "../../../common/dtos/request.dto";
import type {
  IngestEventRequestDTO,
  IngestEventResponseDTO,
} from "../dtos/event.dto";
import { eventRepository } from "../repository/event.repository";

/** Offline-first sync entry point. Duplicate event_id values are ignored, never replayed. */
export class EventService {
  constructor(private readonly events = eventRepository) {}

  async ingest(_context: RequestContextDTO, data: IngestEventRequestDTO): Promise<IngestEventResponseDTO> {
    const accepted = await this.events.ingest(data);
    return { eventId: data.event_id, accepted };
  }
}

export function newEventService(): EventService {
  return new EventService();
}
