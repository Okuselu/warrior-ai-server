import { BaseRepository } from "../../../common/repository/base.repository";
import { CheckInModel, type CheckInRecord } from "../models/checkin.model";

export class CheckInRepository extends BaseRepository<CheckInRecord> {
  constructor() {
    super(CheckInModel);
  }

  findByDay(patient_id: string, local_day: string) {
    return this.model.findOne({ patient_id, local_day }).lean();
  }

  findRecent(patient_id: string, from: string, to: string) {
    return this.model.find({ patient_id, submitted_at: { $gte: from, $lte: to } }).lean();
  }
}

export const checkInRepository = new CheckInRepository();
