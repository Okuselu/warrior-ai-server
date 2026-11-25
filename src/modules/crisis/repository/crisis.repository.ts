import { BaseRepository } from "../../../common/repository/base.repository";
import { CrisisEventModel, type CrisisEventRecord } from "../models/crisis.model";

export class CrisisRepository extends BaseRepository<CrisisEventRecord> {
  constructor() {
    super(CrisisEventModel);
  }

  findByPatient(patient_id: string, from: string, to: string) {
    return this.model.find({ patient_id, started_at: { $gte: from, $lte: to } }).lean();
  }
}

export const crisisRepository = new CrisisRepository();
