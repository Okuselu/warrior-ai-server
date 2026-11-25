import type { RequestContextDTO } from "../../../common/dtos/request.dto";
import { nowISO } from "../../../common/utils/date";
import { NotFoundError } from "../../../common/utils/error.util";
import type {
  CreatePatientRequestDTO,
  PatientResponseDTO,
  RegisterUserRequestDTO,
  UserResponseDTO,
} from "../dtos/identity.dto";
import type { PatientProfileRecord, UserRecord } from "../models/identity.model";
import { patientRepository, userRepository } from "../repository/identity.repository";

export function toUserResponse(record: UserRecord): UserResponseDTO {
  return {
    userId: record.user_id,
    phoneE164: record.phone_e164,
    email: record.email,
    name: record.name,
    role: record.role,
    language: record.language,
    createdAt: record.created_at,
    lastActiveAt: record.last_active_at,
    status: record.status,
    onboardingCompletedAt: record.onboarding_completed_at,
  };
}

export function toPatientResponse(record: PatientProfileRecord): PatientResponseDTO {
  return {
    patientId: record.patient_id,
    ownerUserId: record.owner_user_id,
    displayName: record.display_name,
    birthYear: record.birth_year,
    genotype: record.genotype,
    onHydroxyurea: record.on_hydroxyurea,
    state: record.state,
    lga: record.lga,
    clinicId: record.clinic_id,
    isMinor: record.is_minor,
    guardianConsentId: record.guardian_consent_id,
  };
}

/** Owns users and patient profiles; repositories are injected by the factory. */
export class IdentityService {
  constructor(
    private readonly users = userRepository,
    private readonly patients = patientRepository
  ) {}

  async registerUser(_context: RequestContextDTO, data: RegisterUserRequestDTO): Promise<UserResponseDTO> {
    const timestamp = nowISO();
    const record = await this.users.create({
      user_id: data.userId,
      phone_e164: data.phoneE164,
      email: data.email,
      role: data.role,
      language: data.language,
      created_at: timestamp,
      last_active_at: timestamp,
      status: "active",
    });
    return toUserResponse(record);
  }

  async findUserByPhone(_context: RequestContextDTO, phoneE164: string): Promise<UserResponseDTO | null> {
    const record = await this.users.findByPhone(phoneE164);
    return record ? toUserResponse(record as UserRecord) : null;
  }

  async createPatient(_context: RequestContextDTO, data: CreatePatientRequestDTO): Promise<PatientResponseDTO> {
    const record = await this.patients.create({
      patient_id: data.patientId,
      owner_user_id: data.ownerUserId,
      display_name: data.displayName,
      birth_year: data.birthYear,
      sex: data.sex,
      genotype: data.genotype,
      on_hydroxyurea: data.onHydroxyurea,
      state: data.state,
      lga: data.lga,
      is_minor: false,
    });
    return toPatientResponse(record);
  }

  async getPatient(_context: RequestContextDTO, patientId: string): Promise<PatientResponseDTO> {
    const record = await this.patients.findByPatientId(patientId);
    if (!record) throw new NotFoundError("PatientProfile");
    return toPatientResponse(record);
  }
}

export function newIdentityService(): IdentityService {
  return new IdentityService();
}
