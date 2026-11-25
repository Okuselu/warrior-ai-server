import { BaseRepository } from "../../../common/repository/base.repository";
import { EventModel, type EventRecord } from "../models/event.model";

export class EventRepository extends BaseRepository<EventRecord> {
  constructor() {
    super(EventModel);
  }

  findByPatient(patient_id: string, from: string, to: string) {
    return this.model.find({ patient_id, occurred_at: { $gte: from, $lte: to } }).lean();
  }

  /** Idempotent ingest: an existing event_id is ignored (data contract §7). */
  async ingest(event: EventRecord): Promise<boolean> {
    const result = await this.model.updateOne(
      { event_id: event.event_id },
      { $setOnInsert: event },
      { upsert: true }
    );
    return result.upsertedCount > 0;
  }
}

export const eventRepository = new EventRepository();
