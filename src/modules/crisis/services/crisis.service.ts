import type { RequestContextDTO } from "../../../common/dtos/request.dto";
import type { CrisisResponseDTO, LogCrisisRequestDTO } from "../dtos/crisis.dto";
import type { CrisisEventRecord } from "../models/crisis.model";
import { crisisRepository } from "../repository/crisis.repository";

export function toCrisisResponse(record: CrisisEventRecord): CrisisResponseDTO {
  return {
    crisisId: record.crisis_id,
    patientId: record.patient_id,
    startedAt: record.started_at,
    endedAt: record.ended_at,
    severity: record.severity,
    careSought: record.care_sought,
    precededByAmberOrRedWithin72h: record.preceded_by_amber_or_red_within_72h,
  };
}

export class CrisisService {
  constructor(private readonly crises = crisisRepository) {}

  async log(_context: RequestContextDTO, data: LogCrisisRequestDTO): Promise<CrisisResponseDTO> {
    const record = await this.crises.create({
      crisis_id: data.crisisId,
      patient_id: data.patientId,
      started_at: data.startedAt,
      ended_at: data.endedAt,
      severity: data.severity,
      care_sought: data.careSought,
      facility_id: data.facilityId,
      source: data.source,
    });
    return toCrisisResponse(record);
  }

  async listByPatient(
    _context: RequestContextDTO,
    patientId: string,
    from: string,
    to: string
  ): Promise<CrisisResponseDTO[]> {
    const records = await this.crises.findByPatient(patientId, from, to);
    return records.map((record) => toCrisisResponse(record as CrisisEventRecord));
  }
}

export function newCrisisService(): CrisisService {
  return new CrisisService();
}
