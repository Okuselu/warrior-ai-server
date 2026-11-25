import type { CareSought, CrisisSeverity } from "../../../common/constants";

export interface LogCrisisRequestDTO {
  crisisId: string;
  patientId: string;
  startedAt: string;
  endedAt?: string;
  severity: CrisisSeverity;
  careSought: CareSought;
  facilityId?: string;
  source: "user_logged" | "clinician_logged";
}

export interface CrisisResponseDTO {
  crisisId: string;
  patientId: string;
  startedAt: string;
  endedAt?: string;
  severity: CrisisSeverity;
  careSought: CareSought;
  precededByAmberOrRedWithin72h?: boolean;
}
