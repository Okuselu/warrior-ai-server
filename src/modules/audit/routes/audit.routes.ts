import { Router } from "express";
import { services } from "../../../common/factory/app.factory";
import { asyncHandler } from "../../../common/middleware/async.middleware";
import { getContext } from "../../../common/middleware/request.middleware";
import { ValidationError } from "../../../common/utils/error.util";
import { sendResponse } from "../../../common/utils/response.util";
import type { LogAuditRequestDTO } from "../dtos/audit.dto";

export const auditRouter = Router();

auditRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const data = await services.audit.log(getContext(res), req.body as LogAuditRequestDTO);
    sendResponse(res, { data, message: "Audit recorded", status: 201 });
  })
);

auditRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const entity = typeof req.query.entity === "string" ? req.query.entity : "";
    const entityId = typeof req.query.entityId === "string" ? req.query.entityId : "";
    if (!entity || !entityId) throw new ValidationError("entity and entityId are required");
    const data = await services.audit.listByEntity(getContext(res), entity, entityId);
    sendResponse(res, { data, count: data.length, total: data.length });
  })
);
