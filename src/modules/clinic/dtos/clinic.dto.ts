import type {
  AnnotationRating,
  RecipientType,
  RiskStatus,
} from "../../../common/constants";

export interface CreateShareRequestDTO {
  shareId: string;
  patientId: string;
  windowDays: number;
  recipientType: RecipientType;
}

export interface AnnotateRequestDTO {
  annotationId: string;
  assessmentId: string;
  clinicianUserId: string;
  rating: AnnotationRating;
  note?: string;
}

export interface ShareResponseDTO {
  shareId: string;
  patientId: string;
  createdAt: string;
  expiresAt: string;
  windowDays: number;
  recipientType: RecipientType;
  revokedAt?: string;
}

export interface PatientRiskRowDTO {
  patientId: string;
  latestStatus: RiskStatus;
  assessedAt: string;
  reasons: string[];
}

export interface AnnotationResponseDTO {
  annotationId: string;
  assessmentId: string;
  rating: AnnotationRating;
  note?: string;
  createdAt: string;
}
