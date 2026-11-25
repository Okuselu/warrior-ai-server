import { z } from "zod";
import {
  CONSENT_SCOPES,
  GENOTYPES,
  LANGUAGES,
  RELATIONSHIPS,
  SHARE_LEVELS,
  YES_NO_UNKNOWN,
} from "../../../common/constants";
import type {
  CareCircleContactResponseDTO,
  ConsentResponseDTO,
} from "../../consent/dtos/consent.dto";
import type {
  PatientResponseDTO,
  UserResponseDTO,
} from "./identity.dto";

const phoneE164 = z
  .string()
  .regex(/^\+[1-9]\d{7,14}$/, "phoneE164 must be in international E.164 format");

export const onboardingSchema = z
  .strictObject({
    phoneE164,
    language: z.enum([...LANGUAGES]),
    profile: z.strictObject({
      displayName: z.string().trim().min(2).max(80).optional(),
      birthYear: z
        .number()
        .int()
        .min(1900)
        .max(new Date().getUTCFullYear(), "birthYear cannot be in the future"),
      sex: z.enum(["female", "male", "undisclosed"]).optional(),
      genotype: z.enum([...GENOTYPES]),
      onHydroxyurea: z.enum([...YES_NO_UNKNOWN]),
      state: z.enum(["Lagos", "Ogun", "other"]),
      lga: z.string().trim().min(1).max(80).optional(),
      isMinor: z.boolean().default(false),
      guardianConsentId: z.string().trim().min(1).max(120).optional(),
    }),
    consents: z
      .array(
        z.strictObject({
          scope: z.enum([...CONSENT_SCOPES]),
          granted: z.boolean(),
          version: z.string().trim().min(1).max(20),
        })
      )
      .min(1)
      .max(5),
    careCircle: z
      .array(
        z.strictObject({
          name: z.string().trim().min(2).max(80),
          phoneE164,
          relationship: z.enum([...RELATIONSHIPS]),
          shareLevel: z.enum([...SHARE_LEVELS]),
        })
      )
      .max(5)
      .optional(),
  })
  .superRefine((data, ctx) => {
    for (const required of ["care_circle", "sms_alerts"] as const) {
      const index = data.consents.findIndex((consent) => consent.scope === required);
      if (index === -1) {
        ctx.addIssue({
          code: "custom",
          path: ["consents"],
          message: `${required} consent is required to continue`,
        });
      } else if (!data.consents[index].granted) {
        ctx.addIssue({
          code: "custom",
          path: ["consents", index, "granted"],
          message: `${required} consent must be granted to continue`,
        });
      }
    }

    if (data.profile.isMinor && !data.profile.guardianConsentId) {
      ctx.addIssue({
        code: "custom",
        path: ["profile", "guardianConsentId"],
        message: "guardianConsentId is required for a minor profile",
      });
    }
  });

export type CompleteOnboardingRequestDTO = z.infer<typeof onboardingSchema>;

export interface CompleteOnboardingResponseDTO {
  user: UserResponseDTO;
  patient: PatientResponseDTO;
  consents: ConsentResponseDTO[];
  contacts: CareCircleContactResponseDTO[];
}
