import { Router } from "express";
import { services } from "../../../common/factory/app.factory";
import { asyncHandler } from "../../../common/middleware/async.middleware";
import { getContext } from "../../../common/middleware/request.middleware";
import { ValidationError } from "../../../common/utils/error.util";
import { paginate, toPaginationDTO } from "../../../common/utils/pagination.util";
import { sendResponse } from "../../../common/utils/response.util";
import type { SubmitCheckInRequestDTO } from "../dtos/checkin.dto";

export const checkInRouter = Router();

checkInRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const data = await services.checkin.submit(getContext(res), req.body as SubmitCheckInRequestDTO);
    sendResponse(res, { data, message: "Check-in recorded", status: 201 });
  })
);

checkInRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const patientId = typeof req.query.patientId === "string" ? req.query.patientId : "";
    if (!patientId) throw new ValidationError("patientId is required");

    const query = toPaginationDTO(req.query);
    const all = await services.checkin.listByPatient(
      getContext(res),
      patientId,
      query.from ?? "",
      query.to ?? "9999-12-31T23:59:59Z"
    );
    const page = paginate(all, query);
    sendResponse(res, {
      data: page.items,
      count: page.count,
      total: page.total,
      pagination: page.pagination,
    });
  })
);
