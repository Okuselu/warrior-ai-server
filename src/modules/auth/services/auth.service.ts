import type { RequestContextDTO } from "../../../common/dtos/request.dto";
import type { Role } from "../../../common/constants";
import { nowISO } from "../../../common/utils/date";
import { newId } from "../../../common/utils/id";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../../common/utils/error.util";
import { hashPassword, verifyPassword } from "../../../common/utils/password.util";
import { signAppToken, verifyGoogleIdToken } from "../../../common/utils/token.util";
import type { UserResponseDTO } from "../../identity/dtos/identity.dto";
import { toUserResponse } from "../../identity/services/identity.service";
import { userRepository } from "../../identity/repository/identity.repository";
import type { UserRecord } from "../../identity/models/identity.model";
import type {
  AuthResponseDTO,
  GoogleAuthRequestDTO,
  LoginRequestDTO,
  RegisterRequestDTO,
} from "../dtos/auth.dto";

/**
 * Exchanges verified identities — Google ID tokens or email/password credentials —
 * for a first-party bearer token. Secrets never leave the server boundary.
 */
export class AuthService {
  constructor(private readonly users = userRepository) {}

  async googleSignIn(
    _context: RequestContextDTO,
    data: GoogleAuthRequestDTO
  ): Promise<AuthResponseDTO> {
    const identity = await verifyGoogleIdToken(data.idToken);

    let record = (await this.users.findByOAuth("google", identity.sub)) as UserRecord | null;

    if (record && record.status !== "active") {
      throw new UnauthorizedError("This account is not active");
    }

    if (!record) {
      const timestamp = nowISO();
      record = await this.users.create({
        user_id: newId(),
        name: identity.name,
        email: identity.email?.toLowerCase(),
        role: "patient",
        language: "en",
        created_at: timestamp,
        last_active_at: timestamp,
        status: "active",
        oauth_provider: "google",
        oauth_subject: identity.sub,
      });
    } else {
      record = await this.touch(record);
    }

    return this.issueAuthResponse(record);
  }

  async registerWithPassword(
    _context: RequestContextDTO,
    data: RegisterRequestDTO
  ): Promise<AuthResponseDTO> {
    const existing = await this.users.findByCredentialsEmail(data.email);
    if (existing) {
      throw new ConflictError("An account with this email already exists");
    }

    const timestamp = nowISO();
    const record = await this.users.create({
      user_id: newId(),
      name: data.name,
      email: data.email,
      password_hash: await hashPassword(data.password),
      role: "patient",
      language: "en",
      created_at: timestamp,
      last_active_at: timestamp,
      status: "active",
      oauth_provider: "credentials",
    });

    return this.issueAuthResponse(record);
  }

  async signInWithPassword(
    _context: RequestContextDTO,
    data: LoginRequestDTO
  ): Promise<AuthResponseDTO> {
    const record = await this.users.findByCredentialsEmail(data.email);
    const passwordMatches = record?.password_hash
      ? await verifyPassword(data.password, record.password_hash)
      : false;

    // One generic failure avoids disclosing whether an email is registered.
    if (!record || record.status !== "active" || !passwordMatches) {
      throw new UnauthorizedError("Invalid email or password");
    }

    return this.issueAuthResponse(await this.touch(record));
  }

  async currentUser(context: RequestContextDTO): Promise<UserResponseDTO> {
    if (!context.userId) throw new UnauthorizedError();
    const record = await this.users.findByUserId(context.userId);
    if (!record) throw new NotFoundError("User");
    return toUserResponse(record as UserRecord);
  }

  private async touch(record: UserRecord): Promise<UserRecord> {
    const updated = await this.users.updateByUserId(record.user_id, {
      last_active_at: nowISO(),
    });
    return (updated as UserRecord | null) ?? record;
  }

  private async issueAuthResponse(record: UserRecord): Promise<AuthResponseDTO> {
    const token = await this.issueToken(record.user_id, record.role, record.email);

    return {
      token,
      user: toUserResponse(record),
      onboardingCompleted: Boolean(record.onboarding_completed_at),
    };
  }

  private issueToken(userId: string, role: Role, email?: string): Promise<string> {
    return signAppToken({ userId, role, email });
  }
}

export function newAuthService(): AuthService {
  return new AuthService();
}
