import { uploadImages } from "../../../utils/imageUpload.js";
import { asyncHandler, successResponse } from "../../../utils/response/index.js";
import * as dbService from "../../../database/db.service.js";
import { postModel } from "../../../database/model/index.js";
import { message } from "../../../common/constants/index.js";
import { AppError } from "../../../utils/appError.js";

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


  return post ? successResponse({ res, status: 201, data: post, message: message.post.created }): next(new AppError(message.post.FailedToCreate, 400));
});

export const updatePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let post = await dbService.findOne({
    model: postModel,
    filter: { _id: id, createdBy: req.user._id, isDeleted: { $exists: false } },
    lean: false
  });
  if (!post) return next(new AppError(message.post.NotFound, 404));

  if (req.files.length) {
    req.body.attachments = await uploadImages(req);
  }


  post = await dbService.findOneAndUpdate({
    model: postModel,
    filter: { _id: id, createdBy: req.user._id, isDeleted: { $exists: false } },
    data: { ...req.body, updatedBy: req.user._id },
    options: { new: true }
  });

  return successResponse({ res, status: 200, data: post, message: message.post.updated })
});