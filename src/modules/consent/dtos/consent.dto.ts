import type {
  ConsentScope,
  Language,
  Relationship,
  ShareLevel,
} from "../../../common/constants";

export interface GrantConsentRequestDTO {
  consentId: string;
  patientId: string;
  grantedByUserId: string;
  scope: ConsentScope;
  granted: boolean;
  version: string;
  language: Language;
}

export interface AddCareCircleContactRequestDTO {
  contactId: string;
  patientId: string;
  name: string;
  phoneE164: string;
  relationship: Relationship;
  shareLevel: ShareLevel;
}

export interface ConsentResponseDTO {
  consentId: string;
  patientId: string;
  scope: ConsentScope;
  granted: boolean;
  version: string;
  timestamp: string;
}

export interface CareCircleContactResponseDTO {
  contactId: string;
  patientId: string;
  name: string;
  phoneE164: string;
  relationship: Relationship;
  shareLevel: ShareLevel;
  verifiedAt?: string;
}
