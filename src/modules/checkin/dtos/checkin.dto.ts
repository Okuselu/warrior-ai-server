import type {
  AppetiteLevel,
  CheckInSource,
  FeverLevel,
  FatigueLevel,
  FluidLevel,
  MedsTaken,
  Mood,
  RedFlagCode,
  UrineColour,
} from "../../../common/constants";

export interface SubmitCheckInRequestDTO {
  checkinId: string;
  patientId: string;
  submittedAt: string;
  enteredAtDevice: string;
  source: CheckInSource;
  painScore: number;
  fluids: FluidLevel;
  fever: FeverLevel;
  temperatureC?: number;
  fatigue: FatigueLevel;
  urineColour: UrineColour;
  appetite: AppetiteLevel;
  mood?: Mood;
  redFlags: RedFlagCode[];
  medsTakenToday: MedsTaken;
  appVersion: string;
  deviceIdHash?: string;
  timeZone: string;
}

export interface CheckInResponseDTO {
  checkinId: string;
  patientId: string;
  submittedAt: string;
  painScore: number;
  fluids: FluidLevel;
  fever: FeverLevel;
  fatigue: FatigueLevel;
  urineColour: UrineColour;
  redFlags: RedFlagCode[];
  medsTakenToday: MedsTaken;
  amendsCheckinId?: string;
}
