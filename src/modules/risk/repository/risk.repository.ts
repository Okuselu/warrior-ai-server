import { BaseRepository } from "../../../common/repository/base.repository";
import {
  RiskAssessmentModel,
  RuleSetModel,
  type RiskAssessmentRecord,
  type RuleSetRecord,
} from "../models/risk.model";

export class RiskAssessmentRepository extends BaseRepository<RiskAssessmentRecord> {
  constructor() {
    super(RiskAssessmentModel);
  }

  findByCheckIn(checkin_id: string) {
    return this.model.find({ checkin_id }).sort({ computed_at: -1 }).lean();
  }

  findRecentByPatient(patient_id: string, from: string) {
    return this.model.find({ patient_id, computed_at: { $gte: from } }).lean();
  }
}

export class RuleSetRepository extends BaseRepository<RuleSetRecord> {
  constructor() {
    super(RuleSetModel);
  }

  findActive() {
    return this.model.findOne({ active: true }).lean();
  }

  findByVersion(rule_set_version: string) {
    return this.model.findOne({ rule_set_version }).lean();
  }
}

export const riskAssessmentRepository = new RiskAssessmentRepository();
export const ruleSetRepository = new RuleSetRepository();
