import { Router } from "express";
import { services } from "../../../common/factory/app.factory";
import { asyncHandler } from "../../../common/middleware/async.middleware";
import { getContext, param } from "../../../common/middleware/request.middleware";
import { sendResponse } from "../../../common/utils/response.util";
import type {
  CreatePostRequestDTO,
  JoinGroupRequestDTO,
  ReportPostRequestDTO,
} from "../dtos/community.dto";

export const communityRouter = Router();

communityRouter.get(
  "/groups",
  asyncHandler(async (req, res) => {
    const data = await services.community.listGroups(getContext(res));
    sendResponse(res, { data, count: data.length, total: data.length });
  })
);

communityRouter.post(
  "/groups/:groupId/join",
  asyncHandler(async (req, res) => {
    const data = req.body as Omit<JoinGroupRequestDTO, "groupId">;
    await services.community.joinGroup(getContext(res), { ...data, groupId: param(req, "groupId") });
    sendResponse(res, { data: null, message: "Joined group", status: 201 });
  })
);

communityRouter.post(
  "/posts",
  asyncHandler(async (req, res) => {
    const data = await services.community.createPost(
      getContext(res),
      req.body as CreatePostRequestDTO
    );
    sendResponse(res, { data, message: "Post created", status: 201 });
  })
);

communityRouter.get(
  "/posts",
  asyncHandler(async (req, res) => {
    const groupId = typeof req.query.groupId === "string" ? req.query.groupId : "";
    const data = await services.community.listPosts(getContext(res), groupId);
    sendResponse(res, { data, count: data.length, total: data.length });
  })
);

communityRouter.post(
  "/reports",
  asyncHandler(async (req, res) => {
    const data = await services.community.reportPost(
      getContext(res),
      req.body as ReportPostRequestDTO
    );
    sendResponse(res, { data, message: "Post reported", status: 201 });
  })
);
