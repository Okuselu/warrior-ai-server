import { z } from "zod";
import type { UserResponseDTO } from "../../identity/dtos/identity.dto";

export const googleAuthSchema = z.strictObject({
  idToken: z.string().min(10, "idToken is required"),
});

export type GoogleAuthRequestDTO = z.infer<typeof googleAuthSchema>;

export interface AuthResponseDTO {
  token: string;
  user: UserResponseDTO;
  onboardingCompleted: boolean;
}
