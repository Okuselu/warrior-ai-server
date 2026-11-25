import type { RequestContextDTO } from "../../../common/dtos/request.dto";
import { localCalendarDay } from "../../../common/utils/date";
import type { CheckInResponseDTO, SubmitCheckInRequestDTO } from "../dtos/checkin.dto";
import type { CheckInRecord } from "../models/checkin.model";
import { checkInRepository } from "../repository/checkin.repository";

export function toCheckInResponse(record: CheckInRecord): CheckInResponseDTO {
  return {
    checkinId: record.checkin_id,
    patientId: record.patient_id,
    submittedAt: record.submitted_at,
    painScore: record.pain_score,
    fluids: record.fluids,
    fever: record.fever,
    fatigue: record.fatigue,
    urineColour: record.urine_colour,
    redFlags: record.red_flags,
    medsTakenToday: record.meds_taken_today,
    amendsCheckinId: record.amends_checkin_id,
  };
}

/**
 * Accepts offline-first check-ins. The local calendar day comes from the device
 * time zone; a later same-day submission points at the earlier row via
 * amends_checkin_id and keeps that earlier row as a revision.
 */
export class CheckInService {
  constructor(private readonly checkins = checkInRepository) {}

  async submit(_context: RequestContextDTO, data: SubmitCheckInRequestDTO): Promise<CheckInResponseDTO> {
    const local_day = localCalendarDay(data.submittedAt, data.timeZone);
    const existing = await this.checkins.findByDay(data.patientId, local_day);

    const record = await this.checkins.create({
      checkin_id: data.checkinId,
      patient_id: data.patientId,
      submitted_at: data.submittedAt,
      entered_at_device: data.enteredAtDevice,
      source: data.source,
      pain_score: data.painScore,
      fluids: data.fluids,
      fever: data.fever,
      temperature_c: data.temperatureC,
      fatigue: data.fatigue,
      urine_colour: data.urineColour,
      appetite: data.appetite,
      mood: data.mood,
      red_flags: data.redFlags,
      meds_taken_today: data.medsTakenToday,
      app_version: data.appVersion,
      device_id_hash: data.deviceIdHash,
      local_day,
      amends_checkin_id: existing?.checkin_id,
    });

    return toCheckInResponse(record);
  }

  async listByPatient(
    _context: RequestContextDTO,
    patientId: string,
    from: string,
    to: string
  ): Promise<CheckInResponseDTO[]> {
    const records = await this.checkins.findRecent(patientId, from, to);
    return records.map((record) => toCheckInResponse(record as CheckInRecord));
  }
}

export function newCheckInService(): CheckInService {
  return new CheckInService();
}
