import { BaseRepository } from "../../../common/repository/base.repository";
import {
  DoseLogModel,
  MedicationScheduleModel,
  type DoseLogRecord,
  type MedicationScheduleRecord,
} from "../models/medication.model";

export class MedicationScheduleRepository extends BaseRepository<MedicationScheduleRecord> {
  constructor() {
    super(MedicationScheduleModel);
  }

  findByPatient(patient_id: string) {
    return this.model.find({ patient_id }).lean();
  }
}

export class DoseLogRepository extends BaseRepository<DoseLogRecord> {
  constructor() {
    super(DoseLogModel);
  }

  findBySchedule(schedule_id: string, from: string, to: string) {
    return this.model.find({ schedule_id, scheduled_for: { $gte: from, $lte: to } }).lean();
  }
}

export const medicationScheduleRepository = new MedicationScheduleRepository();
export const doseLogRepository = new DoseLogRepository();
