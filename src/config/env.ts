import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 4000,
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  nodeEnv: process.env.NODE_ENV || "development",
};
