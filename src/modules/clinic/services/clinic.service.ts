import type { RequestContextDTO } from "../../../common/dtos/request.dto";
import { nowISO } from "../../../common/utils/date";
import { NotImplementedError } from "../../../common/utils/error.util";
import type {
  AnnotateRequestDTO,
  AnnotationResponseDTO,
  CreateShareRequestDTO,
  PatientRiskRowDTO,
  ShareResponseDTO,
} from "../dtos/clinic.dto";
import type {
  ClinicianAnnotationRecord,
  ShareRecord,
} from "../models/clinic.model";
import {
  clinicianAnnotationRepository,
  clinicRepository,
  shareRecordRepository,
} from "../repository/clinic.repository";

export function toShareResponse(record: ShareRecord): ShareResponseDTO {
  return {
    shareId: record.share_id,
    patientId: record.patient_id,
    createdAt: record.created_at,
    expiresAt: record.expires_at,
    windowDays: record.window_days,
    recipientType: record.recipient_type,
    revokedAt: record.revoked_at,
  };
}

export function toAnnotationResponse(record: ClinicianAnnotationRecord): AnnotationResponseDTO {
  return {
    annotationId: record.annotation_id,
    assessmentId: record.assessment_id,
    rating: record.rating,
    note: record.note,
    createdAt: record.created_at,
  };
}

/** Share links are time-boxed and revocable; dashboards only show consented patients. */
export class ClinicService {
  constructor(
    private readonly clinics = clinicRepository,
    private readonly shares = shareRecordRepository,
    private readonly annotations = clinicianAnnotationRepository
  ) {}

  async createShare(_context: RequestContextDTO, data: CreateShareRequestDTO): Promise<ShareResponseDTO> {
    const createdAt = nowISO();
    const expiresAt = new Date(Date.now() + data.windowDays * 24 * 60 * 60 * 1000).toISOString();
    const record = await this.shares.create({
      share_id: data.shareId,
      patient_id: data.patientId,
      created_at: createdAt,
      expires_at: expiresAt,
      window_days: data.windowDays,
      recipient_type: data.recipientType,
      access_count: 0,
    });
    return toShareResponse(record);
  }

  async revokeShare(_context: RequestContextDTO, shareId: string): Promise<ShareResponseDTO> {
    const record = await this.shares.revoke(shareId, nowISO());
    if (!record) throw new NotImplementedError("share lookup");
    return toShareResponse(record as ShareRecord);
  }

  async annotate(
    _context: RequestContextDTO,
    data: AnnotateRequestDTO
  ): Promise<AnnotationResponseDTO> {
    const record = await this.annotations.create({
      annotation_id: data.annotationId,
      assessment_id: data.assessmentId,
      clinician_user_id: data.clinicianUserId,
      rating: data.rating,
      note: data.note,
      created_at: nowISO(),
    });
    return toAnnotationResponse(record);
  }

  /** Risk-sorted list for the pilot clinician dashboard (PRD F13). */
  async listRiskRows(_context: RequestContextDTO): Promise<PatientRiskRowDTO[]> {
    throw new NotImplementedError("clinician dashboard");
  }
}

export function newClinicService(): ClinicService {
  return new ClinicService();
}
