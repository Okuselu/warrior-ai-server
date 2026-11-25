import { newAlertService } from "../../modules/alerts/services/alert.service";
import { newAuthService } from "../../modules/auth/services/auth.service";
import { newAuditService } from "../../modules/audit/services/audit.service";
import { newCheckInService } from "../../modules/checkin/services/checkin.service";
import { newClinicService } from "../../modules/clinic/services/clinic.service";
import { newCommunityService } from "../../modules/community/services/community.service";
import { newConsentService } from "../../modules/consent/services/consent.service";
import { newCrisisService } from "../../modules/crisis/services/crisis.service";
import { newEventService } from "../../modules/events/services/event.service";
import { newIdentityService } from "../../modules/identity/services/identity.service";
import { newMedicationService } from "../../modules/medication/services/medication.service";
import { newRiskService } from "../../modules/risk/services/risk.service";

/**
 * Single wiring point for domain services, mirroring troott-api's factory layer.
 * Mongoose models are process-wide, so no database handle needs injecting.
 */
export const services = {
  auth: newAuthService(),
  identity: newIdentityService(),
  consent: newConsentService(),
  checkin: newCheckInService(),
  risk: newRiskService(),
  medication: newMedicationService(),
  crisis: newCrisisService(),
  clinic: newClinicService(),
  community: newCommunityService(),
  events: newEventService(),
  alerts: newAlertService(),
  audit: newAuditService(),
};
