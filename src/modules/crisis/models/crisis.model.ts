import { Schema, model } from "mongoose";
import {
  CARE_SOUGHT,
  CRISIS_SEVERITIES,
  type CareSought,
  type CrisisSeverity,
} from "../../../common/constants";

export interface CrisisEventRecord {
  crisis_id: string;
  patient_id: string;
  started_at: string;
  ended_at?: string;
  severity: CrisisSeverity;
  care_sought: CareSought;
  facility_id?: string;
  /** Derived from risk assessments in the preceding 72 hours (data contract §4.7). */
  preceded_by_amber_or_red_within_72h?: boolean;
  source: "user_logged" | "clinician_logged";
}

const crisisEventSchema = new Schema<CrisisEventRecord>({
  crisis_id: { type: String, required: true, unique: true },
  patient_id: { type: String, required: true, index: true },
  started_at: { type: String, required: true },
  ended_at: { type: String },
  severity: { type: String, enum: [...CRISIS_SEVERITIES], required: true },
  care_sought: { type: String, enum: [...CARE_SOUGHT], required: true },
  facility_id: { type: String },
  preceded_by_amber_or_red_within_72h: { type: Boolean },
  source: { type: String, enum: ["user_logged", "clinician_logged"], required: true },
});

crisisEventSchema.index({ patient_id: 1, started_at: -1 });

export const CrisisEventModel = model<CrisisEventRecord>(
  "CrisisEvent",
  crisisEventSchema,
  "crisis_events"
);
