import { Schema, model } from "mongoose";
import {
  ANNOTATION_RATINGS,
  RECIPIENT_TYPES,
  type AnnotationRating,
  type RecipientType,
} from "../../../common/constants";

export interface ClinicRecord {
  clinic_id: string;
  name: string;
  state: string;
  lga: string;
  phone: string;
  last_verified_at: string;
}

export interface ShareRecord {
  share_id: string;
  patient_id: string;
  created_at: string;
  expires_at: string;
  window_days: number;
  recipient_type: RecipientType;
  access_count: number;
  revoked_at?: string;
}

export interface ClinicianAnnotationRecord {
  annotation_id: string;
  assessment_id: string;
  clinician_user_id: string;
  rating: AnnotationRating;
  note?: string;
  created_at: string;
}

const clinicSchema = new Schema<ClinicRecord>({
  clinic_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  state: { type: String, required: true },
  lga: { type: String, required: true },
  phone: { type: String, required: true },
  last_verified_at: { type: String, required: true },
});

const shareRecordSchema = new Schema<ShareRecord>({
  share_id: { type: String, required: true, unique: true },
  patient_id: { type: String, required: true, index: true },
  created_at: { type: String, required: true },
  expires_at: { type: String, required: true },
  window_days: { type: Number, required: true, default: 30 },
  recipient_type: { type: String, enum: [...RECIPIENT_TYPES], required: true },
  access_count: { type: Number, required: true, default: 0 },
  revoked_at: { type: String },
});

const clinicianAnnotationSchema = new Schema<ClinicianAnnotationRecord>({
  annotation_id: { type: String, required: true, unique: true },
  assessment_id: { type: String, required: true, index: true },
  clinician_user_id: { type: String, required: true },
  rating: { type: String, enum: [...ANNOTATION_RATINGS], required: true },
  note: { type: String, maxlength: 500 },
  created_at: { type: String, required: true },
});

export const ClinicModel = model<ClinicRecord>("Clinic", clinicSchema, "clinics");
export const ShareRecordModel = model<ShareRecord>("ShareRecord", shareRecordSchema, "share_records");
export const ClinicianAnnotationModel = model<ClinicianAnnotationRecord>(
  "ClinicianAnnotation",
  clinicianAnnotationSchema,
  "clinician_annotations"
);
