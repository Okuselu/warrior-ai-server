import { Router } from "express";
import { services } from "../../../common/factory/app.factory";
import { asyncHandler } from "../../../common/middleware/async.middleware";
import { getContext } from "../../../common/middleware/request.middleware";
import { sendResponse } from "../../../common/utils/response.util";
import type { IngestEventRequestDTO } from "../dtos/event.dto";

export const eventRouter = Router();

eventRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const data = await services.events.ingest(getContext(res), req.body as IngestEventRequestDTO);
    sendResponse(res, {
      data,
      message: data.accepted ? "Event accepted" : "Duplicate event ignored",
      status: data.accepted ? 202 : 200,
    });
  })
);
