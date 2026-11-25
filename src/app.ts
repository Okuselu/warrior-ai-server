import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env";
import healthRouter from "./routes/health";
import { errorHandler, notFound } from "./middleware/errorHandler";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientOrigin }));
app.use(express.json({ limit: "1mb" }));

app.use("/api/health", healthRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
