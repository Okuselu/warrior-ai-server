import cors from "cors";
import express, { Router } from "express";
import helmet from "helmet";
import { requestContext } from "../common/middleware/request.middleware";
import { sanitize } from "../common/middleware/sanitize.middleware";
import { errorHandler, notFound } from "../middleware/errorHandler";
import { alertRouter } from "../modules/alerts/routes/alert.routes";
import { authRouter } from "../modules/auth/routes/auth.routes";
import { auditRouter } from "../modules/audit/routes/audit.routes";
import { checkInRouter } from "../modules/checkin/routes/checkin.routes";
import { clinicRouter } from "../modules/clinic/routes/clinic.routes";
import { communityRouter } from "../modules/community/routes/community.routes";
import { consentRouter } from "../modules/consent/routes/consent.routes";
import { crisisRouter } from "../modules/crisis/routes/crisis.routes";
import { eventRouter } from "../modules/events/routes/event.routes";
import { identityRouter } from "../modules/identity/routes/identity.routes";
import { medicationRouter } from "../modules/medication/routes/medication.routes";
import { riskRouter } from "../modules/risk/routes/risk.routes";
import healthRouter from "../routes/health";
import { env } from "./env";

/** Route registration hook, kept separate from middleware like troott-api's routesMiddleware. */
function routes(app: express.Express): void {
  const v1 = Router();

  v1.use("/auth", authRouter);
  v1.use("/identity", identityRouter);
  v1.use("/consent", consentRouter);
  v1.use("/checkins", checkInRouter);
  v1.use("/risk", riskRouter);
  v1.use("/medication", medicationRouter);
  v1.use("/crises", crisisRouter);
  v1.use("/clinic", clinicRouter);
  v1.use("/community", communityRouter);
  v1.use("/events", eventRouter);
  v1.use("/alerts", alertRouter);
  v1.use("/audit", auditRouter);

  app.use(env.apiRoute, v1);
  app.use("/api/health", healthRouter);
}

export function createApplication(): express.Express {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.clientOrigin }));
  app.use(express.json({ limit: "1mb" }));
  app.use(sanitize);
  app.use(requestContext);

  routes(app);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
