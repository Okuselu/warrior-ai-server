import type { CommunityGroupType, PostStatus } from "../../../common/constants";

export interface JoinGroupRequestDTO {
  groupId: string;
  pseudonym: string;
  userId: string;
}

export interface CreatePostRequestDTO {
  postId: string;
  groupId: string;
  pseudonym: string;
  body: string;
}

export interface ReportPostRequestDTO {
  reportId: string;
  postId: string;
  reason: string;
}

export interface GroupResponseDTO {
  groupId: string;
  name: string;
  type: CommunityGroupType;
}

export interface PostResponseDTO {
  postId: string;
  groupId: string;
  pseudonym: string;
  body: string;
  createdAt: string;
  status: PostStatus;
}

export interface ReportResponseDTO {
  reportId: string;
  postId: string;
  reason: string;
  createdAt: string;
}
