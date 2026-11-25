import { z } from "zod";
import type { UserResponseDTO } from "../../identity/dtos/identity.dto";

export const googleAuthSchema = z.strictObject({
  idToken: z.string().min(10, "idToken is required"),
});

export type GoogleAuthRequestDTO = z.infer<typeof googleAuthSchema>;

const emailField = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Enter a valid email address")
  .transform((value) => value.toLowerCase());

const passwordField = z
  .string()
  .min(10, "Password must be at least 10 characters")
  .max(128, "Password must be at most 128 characters")
  .regex(/[A-Za-z]/, "Password must include a letter")
  .regex(/\d/, "Password must include a number");

export const registerSchema = z.strictObject({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: emailField,
  password: passwordField,
});

export type RegisterRequestDTO = z.infer<typeof registerSchema>;

export const loginSchema = z.strictObject({
  email: emailField,
  password: z.string().min(1, "Password is required").max(128),
});

export type LoginRequestDTO = z.infer<typeof loginSchema>;

export interface AuthResponseDTO {
  token: string;
  user: UserResponseDTO;
  onboardingCompleted: boolean;
}
