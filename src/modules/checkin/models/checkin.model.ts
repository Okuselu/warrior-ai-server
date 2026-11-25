import { Schema, model } from "mongoose";
import {
  APPETITE_LEVELS,
  CHECKIN_SOURCES,
  FEVER_LEVELS,
  FATIGUE_LEVELS,
  FLUID_LEVELS,
  MEDS_TAKEN,
  MOODS,
  RED_FLAG_CODES,
  URINE_COLOURS,
  type AppetiteLevel,
  type CheckInSource,
  type FeverLevel,
  type FatigueLevel,
  type FluidLevel,
  type MedsTaken,
  type Mood,
  type RedFlagCode,
  type UrineColour,
} from "../../../common/constants";

export interface CheckInRecord {
  checkin_id: string;
  patient_id: string;
  submitted_at: string;
  entered_at_device: string;
  source: CheckInSource;
  pain_score: number;
  fluids: FluidLevel;
  fever: FeverLevel;
  temperature_c?: number;
  fatigue: FatigueLevel;
  urine_colour: UrineColour;
  appetite: AppetiteLevel;
  mood?: Mood;
  red_flags: RedFlagCode[];
  meds_taken_today: MedsTaken;
  app_version: string;
  device_id_hash?: string;
  /** Derived from submitted_at using the patient's time zone; enforces one check-in per local day. */
  local_day: string;
  /** Set on a later same-day submission; the earlier check-in is kept as a revision. */
  amends_checkin_id?: string;
}

const checkInSchema = new Schema<CheckInRecord>({
  checkin_id: { type: String, required: true, unique: true },
  patient_id: { type: String, required: true, index: true },
  submitted_at: { type: String, required: true },
  entered_at_device: { type: String, required: true },
  source: { type: String, enum: [...CHECKIN_SOURCES], required: true },
  pain_score: { type: Number, required: true, min: 0, max: 10 },
  fluids: { type: String, enum: [...FLUID_LEVELS], required: true },
  fever: { type: String, enum: [...FEVER_LEVELS], required: true },
  temperature_c: { type: Number, min: 34, max: 42 },
  fatigue: { type: String, enum: [...FATIGUE_LEVELS], required: true },
  urine_colour: { type: String, enum: [...URINE_COLOURS], required: true },
  appetite: { type: String, enum: [...APPETITE_LEVELS], required: true },
  mood: { type: String, enum: [...MOODS] },
  red_flags: { type: [{ type: String, enum: [...RED_FLAG_CODES] }], required: true, default: [] },
  meds_taken_today: { type: String, enum: [...MEDS_TAKEN], required: true },
  app_version: { type: String, required: true },
  device_id_hash: { type: String },
  local_day: { type: String, required: true },
  amends_checkin_id: { type: String },
});

// One active check-in per patient per local day is enforced by CheckInService;
// same-day amendments keep the earlier row as a revision, so this index is not unique.
checkInSchema.index({ patient_id: 1, local_day: 1 });
checkInSchema.index({ patient_id: 1, submitted_at: -1 });

export const CheckInModel = model<CheckInRecord>("CheckIn", checkInSchema, "checkins");
