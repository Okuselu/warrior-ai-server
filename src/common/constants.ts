// Controlled vocabularies from the Warrior AI data contract (§4, §5).
// Display text lives in en/yo/pcm resources, never in these codes.

export const ROLES = ["patient", "caregiver", "clinician", "moderator", "admin"] as const;
export type Role = (typeof ROLES)[number];

export const LANGUAGES = ["en", "yo", "pcm"] as const;
export type Language = (typeof LANGUAGES)[number];

export const USER_STATUSES = ["active", "suspended", "deleted"] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export const GENOTYPES = ["HbSS", "HbSC", "HbSBeta0", "HbSBetaPlus", "other", "unknown"] as const;
export type Genotype = (typeof GENOTYPES)[number];

export const YES_NO_UNKNOWN = ["yes", "no", "unknown"] as const;
export type YesNoUnknown = (typeof YES_NO_UNKNOWN)[number];

export const CONSENT_SCOPES = [
  "care_circle",
  "clinic_sharing",
  "research_aggregate",
  "community_participation",
  "sms_alerts",
] as const;
export type ConsentScope = (typeof CONSENT_SCOPES)[number];

export const RELATIONSHIPS = ["parent", "partner", "relative", "friend", "other"] as const;
export type Relationship = (typeof RELATIONSHIPS)[number];

export const SHARE_LEVELS = ["alert_only", "alert_with_status"] as const;
export type ShareLevel = (typeof SHARE_LEVELS)[number];

export const CHECKIN_SOURCES = ["app", "sms", "whatsapp", "clinic_assisted"] as const;
export type CheckInSource = (typeof CHECKIN_SOURCES)[number];

export const FLUID_LEVELS = ["low", "ok", "good"] as const;
export type FluidLevel = (typeof FLUID_LEVELS)[number];

export const FEVER_LEVELS = ["none", "felt_hot", "measured_high", "unknown"] as const;
export type FeverLevel = (typeof FEVER_LEVELS)[number];

export const FATIGUE_LEVELS = ["none", "mild", "moderate", "severe"] as const;
export type FatigueLevel = (typeof FATIGUE_LEVELS)[number];

export const URINE_COLOURS = ["pale", "yellow", "dark", "unknown"] as const;
export type UrineColour = (typeof URINE_COLOURS)[number];

export const APPETITE_LEVELS = ["normal", "reduced", "none"] as const;
export type AppetiteLevel = (typeof APPETITE_LEVELS)[number];

export const MOODS = ["good", "ok", "low"] as const;
export type Mood = (typeof MOODS)[number];

export const MEDS_TAKEN = ["all", "some", "none", "not_applicable"] as const;
export type MedsTaken = (typeof MEDS_TAKEN)[number];

// Clinical lead owns this list and the thresholds. Changing a code needs sign-off + minor bump.
export const RED_FLAG_CODES = [
  "fever_child",
  "chest_pain_or_breathing",
  "stroke_signs",
  "sudden_belly_swelling_or_pallor",
  "prolonged_painful_erection",
  "severe_uncontrolled_pain",
] as const;
export type RedFlagCode = (typeof RED_FLAG_CODES)[number];

export const RISK_STATUSES = ["green", "amber", "red"] as const;
export type RiskStatus = (typeof RISK_STATUSES)[number];

export const RISK_REASON_CODES = [
  "LOW_FLUIDS",
  "DARK_URINE",
  "RISING_PAIN_TREND",
  "MISSED_HU_DOSE",
  "FEVER_REPORTED",
  "COLD_WEATHER",
  "MALARIA_SEASON",
  "HIGH_FATIGUE",
] as const;
export type RiskReasonCode = (typeof RISK_REASON_CODES)[number];

export const CONTEXT_TRIGGERS = [
  "harmattan_cold",
  "malaria_season",
  "recent_infection",
  "missed_hydroxyurea",
  "missed_prophylaxis",
] as const;
export type ContextTrigger = (typeof CONTEXT_TRIGGERS)[number];

export const MEDICINE_TYPES = [
  "hydroxyurea",
  "folic_acid",
  "malaria_prophylaxis",
  "penicillin",
  "other",
] as const;
export type MedicineType = (typeof MEDICINE_TYPES)[number];

export const DOSE_OUTCOMES = ["taken", "skipped", "missed"] as const;
export type DoseOutcome = (typeof DOSE_OUTCOMES)[number];

export const CRISIS_SEVERITIES = ["mild", "moderate", "severe"] as const;
export type CrisisSeverity = (typeof CRISIS_SEVERITIES)[number];

export const CARE_SOUGHT = ["home", "clinic", "emergency", "admitted"] as const;
export type CareSought = (typeof CARE_SOUGHT)[number];

export const RECIPIENT_TYPES = ["clinic", "clinician", "self_print"] as const;
export type RecipientType = (typeof RECIPIENT_TYPES)[number];

export const ANNOTATION_RATINGS = ["useful", "unnecessary", "missed_event"] as const;
export type AnnotationRating = (typeof ANNOTATION_RATINGS)[number];

export const COMMUNITY_GROUP_TYPES = ["caregivers_young_children", "teens", "young_adults"] as const;
export type CommunityGroupType = (typeof COMMUNITY_GROUP_TYPES)[number];

export const POST_STATUSES = ["visible", "removed", "flagged"] as const;
export type PostStatus = (typeof POST_STATUSES)[number];

export const EVENT_TYPES = [
  "checkin.submitted",
  "risk.assessed",
  "alert.sent",
  "redflag.triggered",
  "dose.logged",
  "crisis.logged",
  "share.created",
  "share.revoked",
  "consent.changed",
  "community.reported",
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export const AUDIT_ACTIONS = [
  "view",
  "create",
  "update",
  "delete",
  "export",
  "share",
  "consent_change",
] as const;
export type AuditAction = (typeof AUDIT_ACTIONS)[number];
