import { Router } from "express";
import { services } from "../../../common/factory/app.factory";
import { asyncHandler } from "../../../common/middleware/async.middleware";
import { getContext } from "../../../common/middleware/request.middleware";
import { sendResponse } from "../../../common/utils/response.util";
import type {
  AddCareCircleContactRequestDTO,
  GrantConsentRequestDTO,
} from "../dtos/consent.dto";

export const consentRouter = Router();

consentRouter.post(
  "/consents",
  asyncHandler(async (req, res) => {
    const data = await services.consent.grantConsent(
      getContext(res),
      req.body as GrantConsentRequestDTO
    );
    sendResponse(res, { data, message: "Consent recorded", status: 201 });
  })
);

consentRouter.get(
  "/consents/:scope",
  asyncHandler(async (req, res) => {
    const patientId = typeof req.query.patientId === "string" ? req.query.patientId : "";
    const data = await services.consent.hasConsent(
      getContext(res),
      patientId,
      req.params.scope as GrantConsentRequestDTO["scope"]
    );
    sendResponse(res, { data });
  })
);

consentRouter.post(
  "/contacts",
  asyncHandler(async (req, res) => {
    const data = await services.consent.addContact(
      getContext(res),
      req.body as AddCareCircleContactRequestDTO
    );
    sendResponse(res, { data, message: "Care circle contact added", status: 201 });
  })
);

consentRouter.get(
  "/contacts",
  asyncHandler(async (req, res) => {
    const patientId = typeof req.query.patientId === "string" ? req.query.patientId : "";
    const data = await services.consent.listContacts(getContext(res), patientId);
    sendResponse(res, { data, count: data.length, total: data.length });
  })
);
