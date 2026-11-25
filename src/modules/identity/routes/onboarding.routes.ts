import { Router } from "express";
import { services } from "../../../common/factory/app.factory";
import { authenticate } from "../../../common/middleware/auth.middleware";
import { asyncHandler } from "../../../common/middleware/async.middleware";
import { getContext } from "../../../common/middleware/request.middleware";
import { sendResponse } from "../../../common/utils/response.util";
import { parseBody } from "../../../common/utils/validation.util";
import { onboardingSchema } from "../dtos/onboarding.dto";

export const onboardingRouter = Router();

/** Ownership is always taken from the authenticated context, never from the body. */
onboardingRouter.post(
  "/complete",
  authenticate,
  asyncHandler(async (req, res) => {
    const body = parseBody(onboardingSchema, req.body);
    const data = await services.onboarding.complete(getContext(res), body);
    sendResponse(res, { data, message: "Onboarding complete", status: 201 });
  })
);
