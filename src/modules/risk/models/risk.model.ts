import { Schema, model } from "mongoose";
import {
  CONTEXT_TRIGGERS,
  RISK_REASON_CODES,
  RISK_STATUSES,
  type ContextTrigger,
  type RiskReasonCode,
  type RiskStatus,
} from "../../../common/constants";

export interface RiskReason {
  code: RiskReasonCode;
  label_key: string;
  weight: number;
}

export interface RiskAssessmentRecord {
  assessment_id: string;
  checkin_id: string;
  patient_id: string;
  status: RiskStatus;
  reasons: RiskReason[];
  recommended_action_code: string;
  recheck_at?: string;
  rule_set_version: string;
  computed_at: string;
  computed_on: "device" | "server";
  context_triggers?: ContextTrigger[];
}

export interface RuleSetRecord {
  rule_set_version: string;
  approved_by_clinician_id: string;
  approved_at: string;
  effective_from: string;
  definition: Record<string, unknown>;
  change_note: string;
  active: boolean;
}

const riskReasonSchema = new Schema<RiskReason>(
  {
    code: { type: String, enum: [...RISK_REASON_CODES], required: true },
    label_key: { type: String, required: true },
    weight: { type: Number, required: true },
  },
  { _id: false }
);

const riskAssessmentSchema = new Schema<RiskAssessmentRecord>({
  assessment_id: { type: String, required: true, unique: true },
  checkin_id: { type: String, required: true, index: true },
  patient_id: { type: String, required: true, index: true },
  status: { type: String, enum: [...RISK_STATUSES], required: true },
  reasons: { type: [riskReasonSchema], required: true },
  recommended_action_code: { type: String, required: true },
  recheck_at: { type: String },
  rule_set_version: { type: String, required: true },
  computed_at: { type: String, required: true },
  computed_on: { type: String, enum: ["device", "server"], required: true },
  context_triggers: { type: [{ type: String, enum: [...CONTEXT_TRIGGERS] }] },
});

riskAssessmentSchema.index({ patient_id: 1, computed_at: -1 });

const ruleSetSchema = new Schema<RuleSetRecord>({
  rule_set_version: { type: String, required: true, unique: true },
  approved_by_clinician_id: { type: String, required: true },
  approved_at: { type: String, required: true },
  effective_from: { type: String, required: true },
  definition: { type: Schema.Types.Mixed, required: true },
  change_note: { type: String, required: true },
  active: { type: Boolean, required: true, default: false },
});

export const RiskAssessmentModel = model<RiskAssessmentRecord>(
  "RiskAssessment",
  riskAssessmentSchema,
  "risk_assessments"
);
export const RuleSetModel = model<RuleSetRecord>("RuleSet", ruleSetSchema, "rule_sets");
