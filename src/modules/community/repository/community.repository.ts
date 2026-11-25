import { BaseRepository } from "../../../common/repository/base.repository";
import {
  CommunityGroupModel,
  CommunityMemberModel,
  PostModel,
  PseudonymMapModel,
  ReportModel,
  type CommunityGroupRecord,
  type CommunityMemberRecord,
  type PostRecord,
  type PseudonymMapRecord,
  type ReportRecord,
} from "../models/community.model";

export class CommunityGroupRepository extends BaseRepository<CommunityGroupRecord> {
  constructor() {
    super(CommunityGroupModel);
  }
}

export class CommunityMemberRepository extends BaseRepository<CommunityMemberRecord> {
  constructor() {
    super(CommunityMemberModel);
  }

  findByGroup(group_id: string) {
    return this.model.find({ group_id }).lean();
  }
}

export class PostRepository extends BaseRepository<PostRecord> {
  constructor() {
    super(PostModel);
  }

  findByGroup(group_id: string) {
    return this.model.find({ group_id, status: "visible" }).lean();
  }
}

export class ReportRepository extends BaseRepository<ReportRecord> {
  constructor() {
    super(ReportModel);
  }

  findUnresolved() {
    return this.model.find({ resolved_by: undefined }).lean();
  }
}

/** Restricted repository: moderators must never receive results from this class. */
export class PseudonymMapRepository extends BaseRepository<PseudonymMapRecord> {
  constructor() {
    super(PseudonymMapModel);
  }

  findByUser(user_id: string) {
    return this.model.find({ user_id }).lean();
  }
}

export const communityGroupRepository = new CommunityGroupRepository();
export const communityMemberRepository = new CommunityMemberRepository();
export const postRepository = new PostRepository();
export const reportRepository = new ReportRepository();
export const pseudonymMapRepository = new PseudonymMapRepository();
