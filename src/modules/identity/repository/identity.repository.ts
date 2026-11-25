import { BaseRepository } from "../../../common/repository/base.repository";
import {
  PatientProfileModel,
  UserModel,
  type PatientProfileRecord,
  type UserRecord,
} from "../models/identity.model";

export class UserRepository extends BaseRepository<UserRecord> {
  constructor() {
    super(UserModel);
  }

  findByPhone(phone_e164: string) {
    return this.model.findOne({ phone_e164 }).lean();
  }

  findByUserId(user_id: string) {
    return this.model.findOne({ user_id }).lean();
  }

  findByOAuth(oauth_provider: "google", oauth_subject: string) {
    return this.model.findOne({ oauth_provider, oauth_subject }).lean();
  }

  async findByCredentialsEmail(email: string): Promise<UserRecord | null> {
    return (await this.model
      .findOne({ oauth_provider: "credentials", email })
      .select("+password_hash")
      .lean()) as unknown as UserRecord | null;
  }

  updateByUserId(user_id: string, data: Partial<UserRecord>) {
    return this.model.findOneAndUpdate({ user_id }, data, { new: true }).lean();
  }
}

export class PatientRepository extends BaseRepository<PatientProfileRecord> {
  constructor() {
    super(PatientProfileModel);
  }

  findByOwner(owner_user_id: string) {
    return this.model.find({ owner_user_id }).lean();
  }

  findOneByOwner(owner_user_id: string) {
    return this.model.findOne({ owner_user_id }).lean();
  }

  findByPatientId(patient_id: string) {
    return this.model.findOne({ patient_id }).lean();
  }
}

export const userRepository = new UserRepository();
export const patientRepository = new PatientRepository();
