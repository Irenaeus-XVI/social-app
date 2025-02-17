
import { asyncHandler } from '../../../utils/response/index.js';
import { successResponse } from '../../../utils/response/success.response.js';
import * as dbService from '../../../database/db.service.js';
import { commentModel, postModel } from '../../../database/model/index.js';
import { AppError } from '../../../utils/appError.js';
import { message } from '../../../common/constants/messages.constants.js';
import { uploadImages } from '../../../utils/imageUpload.js';

export const createComment = asyncHandler(async (req, res, next) => {

  const { id } = req.params;

  const post = await dbService.findOne({
    model: postModel,
    filter: { _id: id, isDeleted: { $exists: false } }
  })

  if (!post) return next(new AppError(message.post.NotFound, 404));

  if (req.files?.length) {
    req.body.attachments = await uploadImages({
      req,
      path: `user/${post.createdBy}/post/${id}/comment`
    });
  }

  const comment = await dbService.create({
    model: commentModel,
    data: {
      ...req.body,
      postId: id,
      createdBy: req.user._id
    }
  });
  return successResponse({ res, status: 201, data: comment, message: message.comment.created });
});

export const updateComment = asyncHandler(async (req, res, next) => {

  const { commentId } = req.params;

  const comment = await dbService.findOne({
    model: commentModel,
    filter: { _id: commentId, isDeleted: { $exists: false }, createdBy: req.user._id }
  });

  if (!comment) return next(new AppError(message.comment.NotFound, 404));

  if (req.files?.length) {
    req.body.attachments = await uploadImages({
      req,
      path: `user/${comment.createdBy}/comment/${commentId}`
    });
  }

  const updatedComment = await dbService.findOneAndUpdate({
    model: commentModel,
    filter: { _id: commentId },
    data: { ...req.body },
    options: { new: true }
  });
  return successResponse({ res, status: 200, data: updatedComment, message: message.comment.updated });
});