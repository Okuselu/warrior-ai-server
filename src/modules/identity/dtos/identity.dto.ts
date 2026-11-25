import type { Genotype, Language, Role, UserStatus, YesNoUnknown } from "../../../common/constants";

export interface RegisterUserRequestDTO {
  userId: string;
  phoneE164: string;
  email?: string;
  role: Role;
  language: Language;
}

export interface CreatePatientRequestDTO {
  patientId: string;
  ownerUserId: string;
  displayName?: string;
  birthYear: number;
  sex?: "female" | "male" | "undisclosed";
  genotype: Genotype;
  onHydroxyurea: YesNoUnknown;
  state: "Lagos" | "Ogun" | "other";
  lga?: string;
}

export interface UserResponseDTO {
  userId: string;
  phoneE164?: string;
  email?: string;
  name?: string;
  role: Role;
  language: Language;
  createdAt: string;
  lastActiveAt: string;
  status: UserStatus;
  onboardingCompletedAt?: string;
}

export interface PatientResponseDTO {
  patientId: string;
  ownerUserId: string;
  displayName?: string;
  birthYear: number;
  genotype: Genotype;
  onHydroxyurea: YesNoUnknown;
  state: string;
  lga?: string;
  clinicId?: string;
  isMinor: boolean;
  guardianConsentId?: string;
}
