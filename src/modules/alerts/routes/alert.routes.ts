import { Router } from "express";
import { services } from "../../../common/factory/app.factory";
import { asyncHandler } from "../../../common/middleware/async.middleware";
import { getContext } from "../../../common/middleware/request.middleware";
import { sendResponse } from "../../../common/utils/response.util";
import type { SendAlertRequestDTO } from "../dtos/alert.dto";

export const alertRouter = Router();

alertRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const data = await services.alerts.send(getContext(res), req.body as SendAlertRequestDTO);
    sendResponse(res, { data, message: "Alert queued", status: 202 });
  })
);

alertRouter.get(
  "/failures",
  asyncHandler(async (req, res) => {
    const data = await services.alerts.listFailures(getContext(res));
    sendResponse(res, { data, count: data.length, total: data.length });
  })
);
