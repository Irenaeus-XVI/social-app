import { uploadImages } from "../../../utils/imageUpload.js";
import { asyncHandler, successResponse } from "../../../utils/response/index.js";
import * as dbService from "../../../database/db.service.js";
import { postModel } from "../../../database/model/index.js";
import { message } from "../../../common/constants/messages.constants.js";

export const createPost = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const attachments = await uploadImages(req);

  const post = await dbService.create({
    model: postModel,
    data: {
      content,
      attachments,
      createdBy: req.user._id
    }
  });

  return successResponse({ res, status: 201, data: post, message: message.post.created });
});