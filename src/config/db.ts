import mongoose from "mongoose";
import { env } from "./env";

const MAX_POOL_SIZE = 50_000;
const TIMEOUT_MS = 60_000;

/**
 * Resolves the MongoDB URI from the environment:
 * development/staging/production use MONGODB_URI, anything else (e.g. "test")
 * uses MONGODB_TEST_URI.
 */
function resolveUri(): { uri: string; label: string } {
  if (env.isDev || env.isStaging || env.isProd) {
    return { uri: env.mongoUri, label: "Database connected" };
  }

  if (!env.mongoTestUri) {
    throw new Error("Missing required env var: MONGODB_TEST_URI");
  }

  return { uri: env.mongoTestUri, label: "Database {test} connected" };
}

/** Extracts the host and database name from a MongoDB connection string. */
function mongoHostAndDb(uri: string): { host: string; dbName: string } {
  try {
    const parsed = new URL(uri);
    const dbName =
      decodeURIComponent(parsed.pathname).replace(/^\/+|\/+$/g, "").split("/")[0] || "test";
    return { host: parsed.hostname || uri, dbName };
  } catch {
    return { host: uri, dbName: "test" };
  }
}

/**
 * Connects to MongoDB, verifies connectivity with a ping, and keeps the
 * connection alive for the lifetime of the process (accessible via
 * `mongoose.connection.db`).
 */
export async function connectDB(): Promise<void> {
  const { uri, label } = resolveUri();

  await mongoose.connect(uri, {
    maxPoolSize: MAX_POOL_SIZE,
    connectTimeoutMS: TIMEOUT_MS,
    socketTimeoutMS: TIMEOUT_MS,
    serverSelectionTimeoutMS: TIMEOUT_MS,
    writeConcern: { wtimeoutMS: TIMEOUT_MS },
  });

  try {
    // mongoose.connect resolves before the socket is usable; ping is the real gate.
    await mongoose.connection.db?.command({ ping: 1 });
  } catch (error) {
    await mongoose.disconnect();
    throw error;
  }

  const { host, dbName } = mongoHostAndDb(uri);
  console.log(`${label}: ${host}`);
  console.log(`Database: ${dbName}`);
}

/** Closes the MongoDB connection on shutdown. */
export async function disconnectDB(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
