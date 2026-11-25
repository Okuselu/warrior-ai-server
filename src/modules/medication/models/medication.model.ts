import { Schema, model } from "mongoose";
import {
  DOSE_OUTCOMES,
  MEDICINE_TYPES,
  type DoseOutcome,
  type MedicineType,
} from "../../../common/constants";

export interface MedicationScheduleRecord {
  schedule_id: string;
  patient_id: string;
  medicine_type: MedicineType;
  /** Text exactly as prescribed; the app never calculates doses (PRD F5). */
  label?: string;
  times_of_day: string[];
  start_date: string;
  end_date?: string;
  supply_count?: number;
  supply_updated_at?: string;
}

export interface DoseLogRecord {
  dose_id: string;
  schedule_id: string;
  scheduled_for: string;
  outcome: DoseOutcome;
  logged_at: string;
}

const medicationScheduleSchema = new Schema<MedicationScheduleRecord>({
  schedule_id: { type: String, required: true, unique: true },
  patient_id: { type: String, required: true, index: true },
  medicine_type: { type: String, enum: [...MEDICINE_TYPES], required: true },
  label: { type: String },
  times_of_day: { type: [String], required: true },
  start_date: { type: String, required: true },
  end_date: { type: String },
  supply_count: { type: Number },
  supply_updated_at: { type: String },
});

const doseLogSchema = new Schema<DoseLogRecord>({
  dose_id: { type: String, required: true, unique: true },
  schedule_id: { type: String, required: true, index: true },
  scheduled_for: { type: String, required: true },
  outcome: { type: String, enum: [...DOSE_OUTCOMES], required: true },
  logged_at: { type: String, required: true },
});

doseLogSchema.index({ schedule_id: 1, scheduled_for: 1 }, { unique: true });

export const MedicationScheduleModel = model<MedicationScheduleRecord>(
  "MedicationSchedule",
  medicationScheduleSchema,
  "medication_schedules"
);
export const DoseLogModel = model<DoseLogRecord>("DoseLog", doseLogSchema, "dose_logs");
