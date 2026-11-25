import type { RequestContextDTO } from "../../../common/dtos/request.dto";
import { NotImplementedError } from "../../../common/utils/error.util";
import type {
  AssessRiskRequestDTO,
  RiskAssessmentResponseDTO,
  RuleSetResponseDTO,
} from "../dtos/risk.dto";
import type { RiskAssessmentRecord, RuleSetRecord } from "../models/risk.model";
import { riskAssessmentRepository, ruleSetRepository } from "../repository/risk.repository";
import { newRulesEngineService, type RulesEngineService } from "./rules-engine.service";

export function toRiskAssessmentResponse(record: RiskAssessmentRecord): RiskAssessmentResponseDTO {
  return {
    assessmentId: record.assessment_id,
    checkinId: record.checkin_id,
    patientId: record.patient_id,
    status: record.status,
    reasons: record.reasons.map((reason) => ({
      code: reason.code,
      labelKey: reason.label_key,
      weight: reason.weight,
    })),
    recommendedActionCode: record.recommended_action_code,
    recheckAt: record.recheck_at,
    ruleSetVersion: record.rule_set_version,
    computedAt: record.computed_at,
  };
}

export function toRuleSetResponse(record: RuleSetRecord): RuleSetResponseDTO {
  return {
    ruleSetVersion: record.rule_set_version,
    approvedByClinicianId: record.approved_by_clinician_id,
    approvedAt: record.approved_at,
    effectiveFrom: record.effective_from,
    changeNote: record.change_note,
    active: record.active,
  };
}

/** Assessments are immutable: a reassessment writes a new row referencing the same check-in. */
export class RiskService {
  constructor(
    private readonly assessments = riskAssessmentRepository,
    private readonly ruleSets = ruleSetRepository,
    private readonly rulesEngine: RulesEngineService = newRulesEngineService()
  ) {}

  async assess(_context: RequestContextDTO, _data: AssessRiskRequestDTO): Promise<RiskAssessmentResponseDTO> {
    const active = await this.ruleSets.findActive();
    if (!active) throw new NotImplementedError("approved RuleSet activation");
    throw new NotImplementedError("risk assessment");
  }

  async listByCheckIn(
    _context: RequestContextDTO,
    checkinId: string
  ): Promise<RiskAssessmentResponseDTO[]> {
    const records = await this.assessments.findByCheckIn(checkinId);
    return records.map((record) => toRiskAssessmentResponse(record as RiskAssessmentRecord));
  }

  async getActiveRuleSet(_context: RequestContextDTO): Promise<RuleSetResponseDTO> {
    const record = await this.ruleSets.findActive();
    if (!record) throw new NotImplementedError("approved RuleSet activation");
    return toRuleSetResponse(record);
  }
}

export function newRiskService(): RiskService {
  return new RiskService();
}
