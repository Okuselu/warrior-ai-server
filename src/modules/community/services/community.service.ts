import type { RequestContextDTO } from "../../../common/dtos/request.dto";
import { nowISO } from "../../../common/utils/date";
import type {
  CreatePostRequestDTO,
  GroupResponseDTO,
  JoinGroupRequestDTO,
  PostResponseDTO,
  ReportPostRequestDTO,
  ReportResponseDTO,
} from "../dtos/community.dto";
import type {
  CommunityGroupRecord,
  PostRecord,
  ReportRecord,
} from "../models/community.model";
import {
  communityGroupRepository,
  communityMemberRepository,
  postRepository,
  pseudonymMapRepository,
  reportRepository,
} from "../repository/community.repository";

export function toGroupResponse(record: CommunityGroupRecord): GroupResponseDTO {
  return { groupId: record.group_id, name: record.name, type: record.type };
}

export function toPostResponse(record: PostRecord): PostResponseDTO {
  return {
    postId: record.post_id,
    groupId: record.group_id,
    pseudonym: record.pseudonym,
    body: record.body,
    createdAt: record.created_at,
    status: record.status,
  };
}

export function toReportResponse(record: ReportRecord): ReportResponseDTO {
  return {
    reportId: record.report_id,
    postId: record.post_id,
    reason: record.reason,
    createdAt: record.created_at,
  };
}

/** Moderators only see community DTOs; the pseudonym/user link stays in a restricted repository. */
export class CommunityService {
  constructor(
    private readonly groups = communityGroupRepository,
    private readonly members = communityMemberRepository,
    private readonly posts = postRepository,
    private readonly reports = reportRepository,
    private readonly pseudonyms = pseudonymMapRepository
  ) {}

  async listGroups(_context: RequestContextDTO): Promise<GroupResponseDTO[]> {
    const records = await this.groups.find({});
    return records.map((record) => toGroupResponse(record as CommunityGroupRecord));
  }

  async joinGroup(_context: RequestContextDTO, data: JoinGroupRequestDTO): Promise<void> {
    await this.members.create({
      group_id: data.groupId,
      pseudonym: data.pseudonym,
      joined_at: nowISO(),
    });
    await this.pseudonyms.create({
      group_id: data.groupId,
      pseudonym: data.pseudonym,
      user_id: data.userId,
    });
  }

  async createPost(_context: RequestContextDTO, data: CreatePostRequestDTO): Promise<PostResponseDTO> {
    const record = await this.posts.create({
      post_id: data.postId,
      group_id: data.groupId,
      pseudonym: data.pseudonym,
      body: data.body,
      created_at: nowISO(),
      status: "visible",
    });
    return toPostResponse(record);
  }

  async listPosts(_context: RequestContextDTO, groupId: string): Promise<PostResponseDTO[]> {
    const records = await this.posts.findByGroup(groupId);
    return records.map((record) => toPostResponse(record as PostRecord));
  }

  async reportPost(_context: RequestContextDTO, data: ReportPostRequestDTO): Promise<ReportResponseDTO> {
    const record = await this.reports.create({
      report_id: data.reportId,
      post_id: data.postId,
      reason: data.reason,
      created_at: nowISO(),
    });
    return toReportResponse(record);
  }
}

export function newCommunityService(): CommunityService {
  return new CommunityService();
}
