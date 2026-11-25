import { Router } from "express";
import { services } from "../../../common/factory/app.factory";
import { asyncHandler } from "../../../common/middleware/async.middleware";
import { getContext, param } from "../../../common/middleware/request.middleware";
import { sendResponse } from "../../../common/utils/response.util";
import type {
  AnnotateRequestDTO,
  CreateShareRequestDTO,
} from "../dtos/clinic.dto";

export const clinicRouter = Router();

clinicRouter.post(
  "/shares",
  asyncHandler(async (req, res) => {
    const data = await services.clinic.createShare(
      getContext(res),
      req.body as CreateShareRequestDTO
    );
    sendResponse(res, { data, message: "Share link created", status: 201 });
  })
);

clinicRouter.post(
  "/shares/:shareId/revoke",
  asyncHandler(async (req, res) => {
    const data = await services.clinic.revokeShare(getContext(res), param(req, "shareId"));
    sendResponse(res, { data, message: "Share link revoked" });
  })
);

clinicRouter.post(
  "/annotations",
  asyncHandler(async (req, res) => {
    const data = await services.clinic.annotate(
      getContext(res),
      req.body as AnnotateRequestDTO
    );
    sendResponse(res, { data, message: "Annotation recorded", status: 201 });
  })
);

clinicRouter.get(
  "/dashboard/risk",
  asyncHandler(async (req, res) => {
    const data = await services.clinic.listRiskRows(getContext(res));
    sendResponse(res, { data, count: data.length, total: data.length });
  })
);
