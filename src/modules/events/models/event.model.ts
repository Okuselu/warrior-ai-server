import { Schema, model } from "mongoose";
import { EVENT_TYPES, type EventType } from "../../../common/constants";
import type { EventEnvelope } from "../../../common/types";

export type EventRecord = EventEnvelope<Record<string, unknown>>;

const eventSchema = new Schema<EventRecord>({
  event_id: { type: String, required: true, unique: true },
  event_type: { type: String, enum: [...EVENT_TYPES], required: true },
  schema_version: { type: String, required: true },
  occurred_at: { type: String, required: true },
  patient_id: { type: String },
  payload: { type: Schema.Types.Mixed, required: true },
});

eventSchema.index({ patient_id: 1, occurred_at: -1 });

export const EventModel = model<EventRecord>("Event", eventSchema, "events");
