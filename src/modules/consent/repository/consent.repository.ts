import { BaseRepository } from "../../../common/repository/base.repository";
import {
  CareCircleContactModel,
  ConsentRecordModel,
  type CareCircleContactRecord,
  type ConsentRecord,
} from "../models/consent.model";

export class ConsentRepository extends BaseRepository<ConsentRecord> {
  constructor() {
    super(ConsentRecordModel);
  }

  findLatestByScope(patient_id: string, scope: ConsentRecord["scope"]) {
    return this.model.findOne({ patient_id, scope }).sort({ timestamp: -1 }).lean();
  }
}

export class CareCircleContactRepository extends BaseRepository<CareCircleContactRecord> {
  constructor() {
    super(CareCircleContactModel);
  }

  findByPatient(patient_id: string) {
    return this.model.find({ patient_id }).lean();
  }

  findVerifiedByPatient(patient_id: string) {
    return this.model.find({ patient_id, verified_at: { $ne: undefined } }).lean();
  }
}

export const consentRepository = new ConsentRepository();
export const careCircleContactRepository = new CareCircleContactRepository();
