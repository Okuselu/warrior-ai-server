import type { ConsentScope } from "../../../common/constants";
import type { RequestContextDTO } from "../../../common/dtos/request.dto";
import { nowISO } from "../../../common/utils/date";
import type {
  AddCareCircleContactRequestDTO,
  CareCircleContactResponseDTO,
  ConsentResponseDTO,
  GrantConsentRequestDTO,
} from "../dtos/consent.dto";
import type { CareCircleContactRecord, ConsentRecord } from "../models/consent.model";
import { careCircleContactRepository, consentRepository } from "../repository/consent.repository";

export function toConsentResponse(record: ConsentRecord): ConsentResponseDTO {
  return {
    consentId: record.consent_id,
    patientId: record.patient_id,
    scope: record.scope,
    granted: record.granted,
    version: record.version,
    timestamp: record.timestamp,
  };
}

export function toContactResponse(record: CareCircleContactRecord): CareCircleContactResponseDTO {
  return {
    contactId: record.contact_id,
    patientId: record.patient_id,
    name: record.name,
    phoneE164: record.phone_e164,
    relationship: record.relationship,
    shareLevel: record.share_level,
    verifiedAt: record.verified_at,
  };
}

/** Consent records are append-only: withdrawal is another GrantConsent call with granted=false. */
export class ConsentService {
  constructor(
    private readonly consents = consentRepository,
    private readonly contacts = careCircleContactRepository
  ) {}

  async grantConsent(_context: RequestContextDTO, data: GrantConsentRequestDTO): Promise<ConsentResponseDTO> {
    const record = await this.consents.create({
      consent_id: data.consentId,
      patient_id: data.patientId,
      granted_by_user_id: data.grantedByUserId,
      scope: data.scope,
      granted: data.granted,
      version: data.version,
      language: data.language,
      timestamp: nowISO(),
    });
    return toConsentResponse(record);
  }

  async hasConsent(_context: RequestContextDTO, patientId: string, scope: ConsentScope): Promise<boolean> {
    const latest = await this.consents.findLatestByScope(patientId, scope);
    return latest?.granted === true;
  }

  async addContact(
    _context: RequestContextDTO,
    data: AddCareCircleContactRequestDTO
  ): Promise<CareCircleContactResponseDTO> {
    const record = await this.contacts.create({
      contact_id: data.contactId,
      patient_id: data.patientId,
      name: data.name,
      phone_e164: data.phoneE164,
      relationship: data.relationship,
      share_level: data.shareLevel,
    });
    return toContactResponse(record);
  }

  async listContacts(_context: RequestContextDTO, patientId: string): Promise<CareCircleContactResponseDTO[]> {
    const records = await this.contacts.findByPatient(patientId);
    return records.map((record) => toContactResponse(record as CareCircleContactRecord));
  }
}

export function newConsentService(): ConsentService {
  return new ConsentService();
}
