import { Schema, model } from "mongoose";
import type { ConsentScope } from "../../../common/constants";

export interface AlertDeliveryRecord {
  alert_id: string;
  patient_id: string;
  contact_id?: string;
  channel: "sms" | "whatsapp";
  status: "queued" | "sent" | "failed";
  reason_code?: string;
  attempts: number;
  created_at: string;
  sent_at?: string;
}

const alertDeliverySchema = new Schema<AlertDeliveryRecord>({
  alert_id: { type: String, required: true, unique: true },
  patient_id: { type: String, required: true, index: true },
  contact_id: { type: String },
  channel: { type: String, enum: ["sms", "whatsapp"], required: true },
  status: { type: String, enum: ["queued", "sent", "failed"], required: true, default: "queued" },
  reason_code: { type: String },
  attempts: { type: Number, required: true, default: 0 },
  created_at: { type: String, required: true },
  sent_at: { type: String },
});

alertDeliverySchema.index({ patient_id: 1, created_at: -1 });

export const AlertDeliveryModel = model<AlertDeliveryRecord>(
  "AlertDelivery",
  alertDeliverySchema,
  "alert_deliveries"
);

/** Consent scope required before a care-circle alert may be sent. */
export const ALERT_CONSENT_SCOPE: ConsentScope = "care_circle";
/** PRD F6 / data contract §8: red status -> care-circle SMS within one minute. */
export const ALERT_SLA_MS = 60_000;
