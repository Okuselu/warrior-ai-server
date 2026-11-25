import { NotImplementedError } from "../../../common/utils/error.util";
import type { RiskReasonDTO } from "../dtos/risk.dto";
import type { RuleSetRecord } from "../models/risk.model";

/** Transparent rules v1. Thresholds and codes are clinician-owned (PRD §8 / contract §5). */
export class RulesEngineService {
  /**
   * Given a check-in and the approved rule set, returns a status + ranked reasons.
   * Left explicit until the clinical lead signs off thresholds and the reason list.
   */
  evaluate(_ruleSet: RuleSetRecord, _input: Record<string, unknown>): {
    status: "green" | "amber" | "red";
    reasons: RiskReasonDTO[];
    recommendedActionCode: string;
  } {
    throw new NotImplementedError("risk rule evaluation");
  }
}

export function newRulesEngineService(): RulesEngineService {
  return new RulesEngineService();
}
