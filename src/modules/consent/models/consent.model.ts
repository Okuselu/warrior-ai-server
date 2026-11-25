import { Schema, model } from "mongoose";
import {
  CONSENT_SCOPES,
  LANGUAGES,
  RELATIONSHIPS,
  SHARE_LEVELS,
  type ConsentScope,
  type Language,
  type Relationship,
  type ShareLevel,
} from "../../../common/constants";

export interface ConsentRecord {
  consent_id: string;
  patient_id: string;
  granted_by_user_id: string;
  scope: ConsentScope;
  granted: boolean;
  version: string;
  language: Language;
  timestamp: string;
}

export interface CareCircleContactRecord {
  contact_id: string;
  patient_id: string;
  name: string;
  phone_e164: string;
  relationship: Relationship;
  share_level: ShareLevel;
  verified_at?: string;
}

const consentRecordSchema = new Schema<ConsentRecord>({
  consent_id: { type: String, required: true, unique: true },
  patient_id: { type: String, required: true, index: true },
  granted_by_user_id: { type: String, required: true },
  scope: { type: String, enum: [...CONSENT_SCOPES], required: true },
  granted: { type: Boolean, required: true },
  version: { type: String, required: true },
  language: { type: String, enum: [...LANGUAGES], required: true },
  timestamp: { type: String, required: true },
});

// Consent is append-only: withdrawal is a new record with granted = false.
for (const op of ["findOneAndUpdate", "updateOne", "deleteOne"] as const) {
  consentRecordSchema.pre(op, function () {
    throw new Error("ConsentRecord is append-only");
  });
}
consentRecordSchema.index({ patient_id: 1, scope: 1, timestamp: -1 });

const careCircleContactSchema = new Schema<CareCircleContactRecord>({
  contact_id: { type: String, required: true, unique: true },
  patient_id: { type: String, required: true, index: true },
  name: { type: String, required: true },
  phone_e164: { type: String, required: true },
  relationship: { type: String, enum: [...RELATIONSHIPS], required: true },
  share_level: { type: String, enum: [...SHARE_LEVELS], required: true },
  verified_at: { type: String },
});

export const ConsentRecordModel = model<ConsentRecord>(
  "ConsentRecord",
  consentRecordSchema,
  "consent_records"
);
export const CareCircleContactModel = model<CareCircleContactRecord>(
  "CareCircleContact",
  careCircleContactSchema,
  "care_circle_contacts"
);
