import { Schema, model } from "mongoose";
import {
  GENOTYPES,
  LANGUAGES,
  ROLES,
  USER_STATUSES,
  YES_NO_UNKNOWN,
  type Genotype,
  type Language,
  type Role,
  type UserStatus,
  type YesNoUnknown,
} from "../../../common/constants";

export interface UserRecord {
  user_id: string;
  /** OAuth accounts complete this during onboarding; optional until then. */
  phone_e164?: string;
  email?: string;
  name?: string;
  /** Present only for credentials accounts; never serialized to clients. */
  password_hash?: string;
  role: Role;
  language: Language;
  created_at: string;
  last_active_at: string;
  status: UserStatus;
  oauth_provider?: "google" | "credentials";
  oauth_subject?: string;
  onboarding_completed_at?: string;
}

export interface PatientProfileRecord {
  patient_id: string;
  owner_user_id: string;
  display_name?: string;
  birth_year: number;
  sex?: "female" | "male" | "undisclosed";
  genotype: Genotype;
  on_hydroxyurea: YesNoUnknown;
  state: "Lagos" | "Ogun" | "other";
  lga?: string;
  clinic_id?: string;
  is_minor: boolean;
  guardian_consent_id?: string;
}

const userSchema = new Schema<UserRecord>({
  user_id: { type: String, required: true, unique: true },
  phone_e164: { type: String, unique: true, sparse: true },
  email: { type: String, lowercase: true, trim: true },
  name: { type: String, trim: true },
  password_hash: { type: String, select: false },
  role: { type: String, enum: [...ROLES], required: true },
  language: { type: String, enum: [...LANGUAGES], required: true },
  created_at: { type: String, required: true },
  last_active_at: { type: String, required: true },
  status: { type: String, enum: [...USER_STATUSES], required: true, default: "active" },
});

userSchema.index(
  { oauth_provider: 1, email: 1 },
  { unique: true, partialFilterExpression: { oauth_provider: "credentials" } }
);

const patientProfileSchema = new Schema<PatientProfileRecord>({
  patient_id: { type: String, required: true, unique: true },
  owner_user_id: { type: String, required: true, index: true },
  display_name: { type: String },
  birth_year: { type: Number, required: true },
  sex: { type: String, enum: ["female", "male", "undisclosed"] },
  genotype: { type: String, enum: [...GENOTYPES], required: true },
  on_hydroxyurea: { type: String, enum: [...YES_NO_UNKNOWN], required: true },
  state: { type: String, enum: ["Lagos", "Ogun", "other"], required: true },
  lga: { type: String },
  clinic_id: { type: String },
  is_minor: { type: Boolean, required: true },
  guardian_consent_id: { type: String },
});

patientProfileSchema.pre("validate", function () {
  if (this.is_minor && !this.guardian_consent_id) {
    throw new Error("guardian_consent_id is required when is_minor is true");
  }
});

export const UserModel = model<UserRecord>("User", userSchema, "users");
export const PatientProfileModel = model<PatientProfileRecord>(
  "PatientProfile",
  patientProfileSchema,
  "patient_profiles"
);
