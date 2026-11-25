import { createRemoteJWKSet, jwtVerify, SignJWT, type JWTPayload } from "jose";
import type { Role } from "../constants";
import { env } from "../../config/env";

const googleJWKS = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));
const appSecret = new TextEncoder().encode(env.jwtSecret);
const APP_ISSUER = "warrior-ai";

export interface GoogleIdentity {
  sub: string;
  email?: string;
  name?: string;
}

/** Verifies a Google ID token signature, issuer and audience (OAuth 2.0 / OIDC). */
export async function verifyGoogleIdToken(idToken: string): Promise<GoogleIdentity> {
  const { payload } = await jwtVerify(idToken, googleJWKS, {
    issuer: ["accounts.google.com", "https://accounts.google.com"],
    audience: env.googleClientId,
  });

  if (!payload.sub) throw new Error("Google ID token is missing sub");

  return {
    sub: payload.sub,
    email: typeof payload.email === "string" ? payload.email : undefined,
    name: typeof payload.name === "string" ? payload.name : undefined,
  };
}

export interface AppTokenPayload extends JWTPayload {
  sub: string;
  role: Role;
  email?: string;
}

/** Issues the first-party bearer token used by the web app's backend-for-frontend. */
export async function signAppToken(data: {
  userId: string;
  role: Role;
  email?: string;
}): Promise<string> {
  return new SignJWT({ role: data.role, email: data.email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(APP_ISSUER)
    .setSubject(data.userId)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(appSecret);
}

/** Validates a first-party bearer token and returns its trusted claims. */
export async function verifyAppToken(token: string): Promise<AppTokenPayload> {
  const { payload } = await jwtVerify(token, appSecret, {
    algorithms: ["HS256"],
    issuer: APP_ISSUER,
  });

  if (!payload.sub || typeof payload.role !== "string") {
    throw new Error("Invalid app token claims");
  }

  return payload as AppTokenPayload;
}
