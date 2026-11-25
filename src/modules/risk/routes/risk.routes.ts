import { Router } from "express";
import { services } from "../../../common/factory/app.factory";
import { asyncHandler } from "../../../common/middleware/async.middleware";
import { getContext, param } from "../../../common/middleware/request.middleware";
import { sendResponse } from "../../../common/utils/response.util";
import type { AssessRiskRequestDTO } from "../dtos/risk.dto";

export const riskRouter = Router();

riskRouter.post(
  "/assessments",
  asyncHandler(async (req, res) => {
    const data = await services.risk.assess(getContext(res), req.body as AssessRiskRequestDTO);
    sendResponse(res, { data, message: "Risk assessed", status: 201 });
  })
);

riskRouter.get(
  "/assessments/:checkinId",
  asyncHandler(async (req, res) => {
    const data = await services.risk.listByCheckIn(getContext(res), param(req, "checkinId"));
    sendResponse(res, { data, count: data.length, total: data.length });
  })
);

riskRouter.get(
  "/rules/active",
  asyncHandler(async (req, res) => {
    const data = await services.risk.getActiveRuleSet(getContext(res));
    sendResponse(res, { data });
  })
);
