import { Router } from "express";
import { services } from "../../../common/factory/app.factory";
import { asyncHandler } from "../../../common/middleware/async.middleware";
import { getContext, param } from "../../../common/middleware/request.middleware";
import { sendResponse } from "../../../common/utils/response.util";
import type {
  CreatePatientRequestDTO,
  RegisterUserRequestDTO,
} from "../dtos/identity.dto";

export const identityRouter = Router();

identityRouter.post(
  "/users",
  asyncHandler(async (req, res) => {
    const data = await services.identity.registerUser(
      getContext(res),
      req.body as RegisterUserRequestDTO
    );
    sendResponse(res, { data, message: "User registered", status: 201 });
  })
);

identityRouter.get(
  "/users/phone/:phoneE164",
  asyncHandler(async (req, res) => {
    const data = await services.identity.findUserByPhone(getContext(res), param(req, "phoneE164"));
    sendResponse(res, { data });
  })
);

identityRouter.post(
  "/patients",
  asyncHandler(async (req, res) => {
    const data = await services.identity.createPatient(
      getContext(res),
      req.body as CreatePatientRequestDTO
    );
    sendResponse(res, { data, message: "Patient profile created", status: 201 });
  })
);

identityRouter.get(
  "/patients/:patientId",
  asyncHandler(async (req, res) => {
    const data = await services.identity.getPatient(getContext(res), param(req, "patientId"));
    sendResponse(res, { data });
  })
);
