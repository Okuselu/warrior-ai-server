import { Router } from "express";
import { services } from "../../../common/factory/app.factory";
import { asyncHandler } from "../../../common/middleware/async.middleware";
import { getContext } from "../../../common/middleware/request.middleware";
import { ValidationError } from "../../../common/utils/error.util";
import { sendResponse } from "../../../common/utils/response.util";
import type { LogCrisisRequestDTO } from "../dtos/crisis.dto";

export const crisisRouter = Router();

crisisRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const data = await services.crisis.log(getContext(res), req.body as LogCrisisRequestDTO);
    sendResponse(res, { data, message: "Crisis logged", status: 201 });
  })
);

crisisRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const patientId = typeof req.query.patientId === "string" ? req.query.patientId : "";
    if (!patientId) throw new ValidationError("patientId is required");
    const from = typeof req.query.from === "string" ? req.query.from : "";
    const to = typeof req.query.to === "string" ? req.query.to : "9999-12-31T23:59:59Z";
    const data = await services.crisis.listByPatient(getContext(res), patientId, from, to);
    sendResponse(res, { data, count: data.length, total: data.length });
  })
);
