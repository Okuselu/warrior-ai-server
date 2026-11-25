import { Router } from "express";
import { services } from "../../../common/factory/app.factory";
import { asyncHandler } from "../../../common/middleware/async.middleware";
import { getContext } from "../../../common/middleware/request.middleware";
import { ValidationError } from "../../../common/utils/error.util";
import { sendResponse } from "../../../common/utils/response.util";
import type {
  CreateScheduleRequestDTO,
  LogDoseRequestDTO,
} from "../dtos/medication.dto";

export const medicationRouter = Router();

medicationRouter.post(
  "/schedules",
  asyncHandler(async (req, res) => {
    const data = await services.medication.createSchedule(
      getContext(res),
      req.body as CreateScheduleRequestDTO
    );
    sendResponse(res, { data, message: "Schedule created", status: 201 });
  })
);

medicationRouter.post(
  "/doses",
  asyncHandler(async (req, res) => {
    const data = await services.medication.logDose(getContext(res), req.body as LogDoseRequestDTO);
    sendResponse(res, { data, message: "Dose logged", status: 201 });
  })
);

medicationRouter.get(
  "/schedules",
  asyncHandler(async (req, res) => {
    const patientId = typeof req.query.patientId === "string" ? req.query.patientId : "";
    if (!patientId) throw new ValidationError("patientId is required");
    const data = await services.medication.listSchedules(getContext(res), patientId);
    sendResponse(res, { data, count: data.length, total: data.length });
  })
);
