import { asyncHandler } from "../../../utils/response/index.js";
import { successResponse } from "../../../utils/response/index.js";
import * as dbService from "../../../database/db.service.js";
import { userModel } from "../../../database/model/index.js";
export const profile = asyncHandler(async (req, res, next) => {
  const user = await dbService.findOne({
    model: userModel, filter: { _id: req.user._id }, select: "-password", populate: [{
      path: "viewers.userId",
      select: "userName image email"
    }]
  });
  return successResponse({ res, status: 200, data: user });
});

export const shareProfile = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let user = null;
  if (req.user._id.toString() === id) {
    user = req.user;
  } else {
    user = await dbService.findOneAndUpdate(
      {
        model: userModel,
        filter: { _id: id, isDeleted: false },
        data: {
          $push: { viewers: { userId: req.user._id, time: new Date() } }
        },
        select: "userName image email",
      }
    );
  }

  return user ? successResponse({ res, status: 200, data: user }) : next(new AppError(message.user.NotFound, 404));
});