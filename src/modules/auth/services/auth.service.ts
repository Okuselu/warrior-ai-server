import type { RequestContextDTO } from "../../../common/dtos/request.dto";
import { nowISO } from "../../../common/utils/date";
import { newId } from "../../../common/utils/id";
import { NotFoundError, UnauthorizedError } from "../../../common/utils/error.util";
import { signAppToken, verifyGoogleIdToken } from "../../../common/utils/token.util";
import type { UserResponseDTO } from "../../identity/dtos/identity.dto";
import { toUserResponse } from "../../identity/services/identity.service";
import { userRepository } from "../../identity/repository/identity.repository";
import type { UserRecord } from "../../identity/models/identity.model";
import type { AuthResponseDTO, GoogleAuthRequestDTO } from "../dtos/auth.dto";

/**
 * Exchanges a verified Google identity for a first-party bearer token. Google tokens
 * never reach client-side code: Auth.js holds them server-side and sends only the
 * short-lived ID token to this endpoint.
 */
export class AuthService {
  constructor(private readonly users = userRepository) {}

  async googleSignIn(
    _context: RequestContextDTO,
    data: GoogleAuthRequestDTO
  ): Promise<AuthResponseDTO> {
    const identity = await verifyGoogleIdToken(data.idToken);

    let record = (await this.users.findByOAuth("google", identity.sub)) as UserRecord | null;

    if (!record) {
      const timestamp = nowISO();
      record = await this.users.create({
        user_id: newId(),
        email: identity.email,
        role: "patient",
        language: "en",
        created_at: timestamp,
        last_active_at: timestamp,
        status: "active",
        oauth_provider: "google",
        oauth_subject: identity.sub,
      });
    }

    const token = await signAppToken({
      userId: record.user_id,
      role: record.role,
      email: record.email,
    });

    return {
      token,
      user: toUserResponse(record as UserRecord),
      onboardingCompleted: Boolean(record.onboarding_completed_at),
    };
  }

  async currentUser(context: RequestContextDTO): Promise<UserResponseDTO> {
    if (!context.userId) throw new UnauthorizedError();
    const record = await this.users.findByUserId(context.userId);
    if (!record) throw new NotFoundError("User");
    return toUserResponse(record as UserRecord);
  }
}

export function newAuthService(): AuthService {
  return new AuthService();
}
