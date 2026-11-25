import type { RequestContextDTO } from "../../../common/dtos/request.dto";
import type {
  CreateScheduleRequestDTO,
  DoseLogResponseDTO,
  LogDoseRequestDTO,
  ScheduleResponseDTO,
} from "../dtos/medication.dto";
import type { DoseLogRecord, MedicationScheduleRecord } from "../models/medication.model";
import { doseLogRepository, medicationScheduleRepository } from "../repository/medication.repository";

export function toScheduleResponse(record: MedicationScheduleRecord): ScheduleResponseDTO {
  return {
    scheduleId: record.schedule_id,
    patientId: record.patient_id,
    medicineType: record.medicine_type,
    label: record.label,
    timesOfDay: record.times_of_day,
    startDate: record.start_date,
    endDate: record.end_date,
    supplyCount: record.supply_count,
  };
}

export function toDoseResponse(record: DoseLogRecord): DoseLogResponseDTO {
  return {
    doseId: record.dose_id,
    scheduleId: record.schedule_id,
    scheduledFor: record.scheduled_for,
    outcome: record.outcome,
    loggedAt: record.logged_at,
  };
}

/** Reminder schedules and logs. The app never calculates or changes doses (PRD F5). */
export class MedicationService {
  constructor(
    private readonly schedules = medicationScheduleRepository,
    private readonly doses = doseLogRepository
  ) {}

  async createSchedule(
    _context: RequestContextDTO,
    data: CreateScheduleRequestDTO
  ): Promise<ScheduleResponseDTO> {
    const record = await this.schedules.create({
      schedule_id: data.scheduleId,
      patient_id: data.patientId,
      medicine_type: data.medicineType,
      label: data.label,
      times_of_day: data.timesOfDay,
      start_date: data.startDate,
      end_date: data.endDate,
      supply_count: data.supplyCount,
    });
    return toScheduleResponse(record);
  }

  async logDose(_context: RequestContextDTO, data: LogDoseRequestDTO): Promise<DoseLogResponseDTO> {
    const record = await this.doses.create({
      dose_id: data.doseId,
      schedule_id: data.scheduleId,
      scheduled_for: data.scheduledFor,
      outcome: data.outcome,
      logged_at: data.loggedAt,
    });
    return toDoseResponse(record);
  }

  async listSchedules(
    _context: RequestContextDTO,
    patientId: string
  ): Promise<ScheduleResponseDTO[]> {
    const records = await this.schedules.findByPatient(patientId);
    return records.map((record) => toScheduleResponse(record as MedicationScheduleRecord));
  }
}

export function newMedicationService(): MedicationService {
  return new MedicationService();
}
