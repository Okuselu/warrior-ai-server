import type {
  ContextTrigger,
  RiskReasonCode,
  RiskStatus,
} from "../../../common/constants";

export interface AssessRiskRequestDTO {
  assessmentId: string;
  checkinId: string;
  patientId: string;
  computedOn: "device" | "server";
  contextTriggers?: ContextTrigger[];
}

export interface RiskReasonDTO {
  code: RiskReasonCode;
  labelKey: string;
  weight: number;
}

export interface RiskAssessmentResponseDTO {
  assessmentId: string;
  checkinId: string;
  patientId: string;
  status: RiskStatus;
  reasons: RiskReasonDTO[];
  recommendedActionCode: string;
  recheckAt?: string;
  ruleSetVersion: string;
  computedAt: string;
}

export interface RuleSetResponseDTO {
  ruleSetVersion: string;
  approvedByClinicianId: string;
  approvedAt: string;
  effectiveFrom: string;
  changeNote: string;
  active: boolean;
}
