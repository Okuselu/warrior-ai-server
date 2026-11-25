import { Schema, model } from "mongoose";
import {
  COMMUNITY_GROUP_TYPES,
  POST_STATUSES,
  type CommunityGroupType,
  type PostStatus,
} from "../../../common/constants";

export interface CommunityGroupRecord {
  group_id: string;
  name: string;
  type: CommunityGroupType;
  moderator_user_ids: string[];
}

export interface CommunityMemberRecord {
  group_id: string;
  pseudonym: string;
  joined_at: string;
}

export interface PostRecord {
  post_id: string;
  group_id: string;
  pseudonym: string;
  body: string;
  created_at: string;
  status: PostStatus;
}

export interface ReportRecord {
  report_id: string;
  post_id: string;
  reason: string;
  created_at: string;
  resolved_by?: string;
  resolution?: string;
}

/** Restricted mapping: never exposed to moderators (data contract §4.11). */
export interface PseudonymMapRecord {
  group_id: string;
  pseudonym: string;
  user_id: string;
}

const communityGroupSchema = new Schema<CommunityGroupRecord>({
  group_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, enum: [...COMMUNITY_GROUP_TYPES], required: true },
  moderator_user_ids: { type: [String], required: true },
});

const communityMemberSchema = new Schema<CommunityMemberRecord>({
  group_id: { type: String, required: true, index: true },
  pseudonym: { type: String, required: true },
  joined_at: { type: String, required: true },
});

communityMemberSchema.index({ group_id: 1, pseudonym: 1 }, { unique: true });

const postSchema = new Schema<PostRecord>({
  post_id: { type: String, required: true, unique: true },
  group_id: { type: String, required: true, index: true },
  pseudonym: { type: String, required: true },
  body: { type: String, required: true, maxlength: 2000 },
  created_at: { type: String, required: true },
  status: { type: String, enum: [...POST_STATUSES], required: true, default: "visible" },
});

const reportSchema = new Schema<ReportRecord>({
  report_id: { type: String, required: true, unique: true },
  post_id: { type: String, required: true, index: true },
  reason: { type: String, required: true },
  created_at: { type: String, required: true },
  resolved_by: { type: String },
  resolution: { type: String },
});

const pseudonymMapSchema = new Schema<PseudonymMapRecord>({
  group_id: { type: String, required: true },
  pseudonym: { type: String, required: true },
  user_id: { type: String, required: true },
});

pseudonymMapSchema.index({ group_id: 1, pseudonym: 1 }, { unique: true });

export const CommunityGroupModel = model<CommunityGroupRecord>(
  "CommunityGroup",
  communityGroupSchema,
  "community_groups"
);
export const CommunityMemberModel = model<CommunityMemberRecord>(
  "CommunityMember",
  communityMemberSchema,
  "community_members"
);
export const PostModel = model<PostRecord>("Post", postSchema, "posts");
export const ReportModel = model<ReportRecord>("Report", reportSchema, "reports");
export const PseudonymMapModel = model<PseudonymMapRecord>(
  "PseudonymMap",
  pseudonymMapSchema,
  "pseudonym_maps"
);
