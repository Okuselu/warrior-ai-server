import type { DoseOutcome, MedicineType } from "../../../common/constants";

export interface CreateScheduleRequestDTO {
  scheduleId: string;
  patientId: string;
  medicineType: MedicineType;
  label?: string;
  timesOfDay: string[];
  startDate: string;
  endDate?: string;
  supplyCount?: number;
}

export interface LogDoseRequestDTO {
  doseId: string;
  scheduleId: string;
  scheduledFor: string;
  outcome: DoseOutcome;
  loggedAt: string;
}

export interface ScheduleResponseDTO {
  scheduleId: string;
  patientId: string;
  medicineType: MedicineType;
  label?: string;
  timesOfDay: string[];
  startDate: string;
  endDate?: string;
  supplyCount?: number;
}

export interface DoseLogResponseDTO {
  doseId: string;
  scheduleId: string;
  scheduledFor: string;
  outcome: DoseOutcome;
  loggedAt: string;
}
