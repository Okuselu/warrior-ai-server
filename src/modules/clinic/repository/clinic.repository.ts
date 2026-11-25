import { BaseRepository } from "../../../common/repository/base.repository";
import {
  ClinicModel,
  ClinicianAnnotationModel,
  ShareRecordModel,
  type ClinicRecord,
  type ClinicianAnnotationRecord,
  type ShareRecord,
} from "../models/clinic.model";

export class ClinicRepository extends BaseRepository<ClinicRecord> {
  constructor() {
    super(ClinicModel);
  }

  findByState(state: string) {
    return this.model.find({ state }).lean();
  }
}

export class ShareRecordRepository extends BaseRepository<ShareRecord> {
  constructor() {
    super(ShareRecordModel);
  }

  findActiveByPatient(patient_id: string) {
    return this.model.find({ patient_id, revoked_at: undefined }).lean();
  }

  findByShareId(share_id: string) {
    return this.model.findOne({ share_id }).lean();
  }

  revoke(share_id: string, revoked_at: string) {
    return this.model.findOneAndUpdate({ share_id }, { revoked_at }, { new: true }).lean();
  }
}

export class ClinicianAnnotationRepository extends BaseRepository<ClinicianAnnotationRecord> {
  constructor() {
    super(ClinicianAnnotationModel);
  }

  findByAssessment(assessment_id: string) {
    return this.model.find({ assessment_id }).lean();
  }
}

export const clinicRepository = new ClinicRepository();
export const shareRecordRepository = new ShareRecordRepository();
export const clinicianAnnotationRepository = new ClinicianAnnotationRepository();
