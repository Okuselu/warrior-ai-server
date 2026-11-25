import { createHash } from "node:crypto";
import type { RequestContextDTO } from "../../../common/dtos/request.dto";
import { nowISO } from "../../../common/utils/date";
import { newId } from "../../../common/utils/id";
import { NotFoundError, UnauthorizedError } from "../../../common/utils/error.util";
import { newAuditService, type AuditService } from "../../audit/services/audit.service";
import {
  toContactResponse,
  toConsentResponse,
} from "../../consent/services/consent.service";
import {
  careCircleContactRepository,
  consentRepository,
} from "../../consent/repository/consent.repository";
import type { CareCircleContactRecord, ConsentRecord } from "../../consent/models/consent.model";
import type { CompleteOnboardingRequestDTO, CompleteOnboardingResponseDTO } from "../dtos/onboarding.dto";
import type { PatientProfileRecord, UserRecord } from "../models/identity.model";
import { patientRepository, userRepository } from "../repository/identity.repository";
import { toPatientResponse, toUserResponse } from "./identity.service";

/** Completes signup: profile, mandatory consents, optional care circle, audit trail. */
export class OnboardingService {
  constructor(
    private readonly users = userRepository,
    private readonly patients = patientRepository,
    private readonly consents = consentRepository,
    private readonly contacts = careCircleContactRepository,
    private readonly audit: AuditService = newAuditService()
  ) {}

  async complete(
    context: RequestContextDTO,
    data: CompleteOnboardingRequestDTO
  ): Promise<CompleteOnboardingResponseDTO> {
    if (!context.userId) throw new UnauthorizedError();

    const user = await this.users.findByUserId(context.userId);
    if (!user) throw new NotFoundError("User");

    let patient = (await this.patients.findOneByOwner(context.userId)) as PatientProfileRecord | null;

    if (!patient) {
      patient = await this.patients.create({
        patient_id: newId(),
        owner_user_id: context.userId,
        display_name: data.profile.displayName,
        birth_year: data.profile.birthYear,
        sex: data.profile.sex,
        genotype: data.profile.genotype,
        on_hydroxyurea: data.profile.onHydroxyurea,
        state: data.profile.state,
        lga: data.profile.lga,
        is_minor: data.profile.isMinor,
        guardian_consent_id: data.profile.guardianConsentId,
      });
    }

    for (const consent of data.consents) {
      // Deterministic IDs make retries idempotent; consent rows remain append-only.
      const consent_id = `consent:${context.userId}:${consent.scope}:${consent.version}`;
      const existing = await this.consents.findOne({ consent_id });
      if (!existing) {
        await this.consents.create({
          consent_id,
          patient_id: patient.patient_id,
          granted_by_user_id: context.userId,
          scope: consent.scope,
          granted: consent.granted,
          version: consent.version,
          language: data.language,
          timestamp: nowISO(),
        });
      }
    }

    for (const contact of data.careCircle ?? []) {
      await this.contacts.create({
        contact_id: newId(),
        patient_id: patient.patient_id,
        name: contact.name,
        phone_e164: contact.phoneE164,
        relationship: contact.relationship,
        share_level: contact.shareLevel,
      });
    }

    const timestamp = nowISO();
    const updatedUser = await this.users.updateByUserId(context.userId, {
      phone_e164: data.phoneE164,
      language: data.language,
      last_active_at: timestamp,
      onboarding_completed_at: timestamp,
    });

    await this.audit.log(context, {
      actorUserId: context.userId,
      actorRole: context.roles?.[0] ?? "patient",
      action: "create",
      entity: "PatientProfile",
      entityId: patient.patient_id,
      ipHash: createHash("sha256").update(context.ip ?? "").digest("hex"),
    });

    const consentRows = await this.consents.find({ patient_id: patient.patient_id });
    const contactRows = await this.contacts.findByPatient(patient.patient_id);

    return {
      user: toUserResponse((updatedUser ?? user) as UserRecord),
      patient: toPatientResponse(patient as PatientProfileRecord),
      consents: consentRows
        .map((row) => toConsentResponse(row as ConsentRecord))
        .sort((a, b) => a.scope.localeCompare(b.scope)),
      contacts: contactRows.map((row) => toContactResponse(row as CareCircleContactRecord)),
    };
  }
}

export function newOnboardingService(): OnboardingService {
  return new OnboardingService();
}
