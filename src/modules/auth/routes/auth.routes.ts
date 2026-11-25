import { Router } from "express";
import { services } from "../../../common/factory/app.factory";
import { authenticate } from "../../../common/middleware/auth.middleware";
import { asyncHandler } from "../../../common/middleware/async.middleware";
import { getContext } from "../../../common/middleware/request.middleware";
import { parseBody } from "../../../common/utils/validation.util";
import { sendResponse } from "../../../common/utils/response.util";
import { googleAuthSchema, loginSchema, registerSchema } from "../dtos/auth.dto";

export const authRouter = Router();

/** Public: receives the Google ID token obtained by Auth.js on the web server. */
authRouter.post(
  "/google",
  asyncHandler(async (req, res) => {
    const body = parseBody(googleAuthSchema, req.body);
    const data = await services.auth.googleSignIn(getContext(res), body);
    sendResponse(res, { data, message: "Signed in with Google" });
  })
);

/** Public: creates an email/password account with a scrypt-hashed password. */
authRouter.post(
  "/register",
  asyncHandler(async (req, res) => {
    const body = parseBody(registerSchema, req.body);
    const data = await services.auth.registerWithPassword(getContext(res), body);
    sendResponse(res, { data, message: "Account created", status: 201 });
  })
);

/** Public: verifies credentials and issues the same first-party token as Google. */
authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const body = parseBody(loginSchema, req.body);
    const data = await services.auth.signInWithPassword(getContext(res), body);
    sendResponse(res, { data, message: "Signed in" });
  })
);

/** Protected: resolves the authenticated identity propagated into RequestContextDTO. */
authRouter.get(
  "/me",
  authenticate,
  asyncHandler(async (_req, res) => {
    const data = await services.auth.currentUser(getContext(res));
    sendResponse(res, { data });
  })
);
