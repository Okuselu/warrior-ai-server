import dotenv from "dotenv";

dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

const nodeEnv = process.env.NODE_ENV || "development";

export const env = {
  port: Number(process.env.PORT) || 4000,
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  apiRoute: process.env.API_ROUTE || "/api/v1",
  nodeEnv,
  isDev: nodeEnv === "development",
  isStaging: nodeEnv === "staging",
  isProd: nodeEnv === "production",
  mongoUri: required("MONGODB_URI"),
  // Used when NODE_ENV is anything other than development/staging/production (e.g. "test").
  mongoTestUri: process.env.MONGODB_TEST_URI,
  googleClientId: required("GOOGLE_CLIENT_ID"),
  jwtSecret: required("JWT_SECRET"),
};
