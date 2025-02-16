import { asyncHandler } from "../../../utils/response/index.js";
import { successResponse } from "../../../utils/response/index.js";
import * as dbService from "../../../database/db.service.js";
import { userModel } from "../../../database/model/index.js";
import { CONFIRM_EMAIL_OTP, message, UPDATE_EMAIL_OTP } from "../../../common/constants/index.js";
import { emailEvent } from "../../../utils/events/email.event.js";
import { compareHash, generateHash, validateOTP } from "../../../utils/security/index.js";
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

export const updateEmail = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await dbService.findOne({
    model: userModel,
    filter: { email, isDeleted: false },
  })
  if (user) {
    return next(new AppError(message.user.AlreadyExists, 400));
  }
  console.log(req.user);

  await dbService.updateOne({
    model: userModel,
    filter: { _id: req.user._id },
    data: { tempEmail: email },
  });

  emailEvent.emit("sendConfirmEmail", { email: req.user.email });
  emailEvent.emit("sendUpdateEmail", { email });
  return successResponse({ res, status: 200, message: message.user.OTP_Sent });
});


export const resetEmail = asyncHandler(async (req, res, next) => {
  const { oldCode, newCode } = req.body;

  await validateOTP({ email: req.user.email, code: oldCode, type: CONFIRM_EMAIL_OTP });
  await validateOTP({ email: req.user.tempEmail, code: newCode, type: UPDATE_EMAIL_OTP });

  await dbService.updateOne({
    model: userModel,
    filter: { _id: req.user._id },
    data: { email: req.user.tempEmail, tempEmail: null, changeCredentialTime: Date.now() },
  });
  return successResponse({ res, status: 200, message: message.user.EmailUpdated });
});

export const updatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!compareHash({ plainText: oldPassword, hash: req.user.password })) {
    return next(new AppError(message.user.WrongPassword, 400));
  }

  const hashPassword = generateHash({ plainText: newPassword });

  await dbService.updateOne({
    model: userModel,
    filter: { _id: req.user._id },
    data: { password: hashPassword, changeCredentialTime: Date.now() },
  });

  return successResponse({ res, status: 200, message: message.user.Password_Updated });
});

export const updateProfile = asyncHandler(async (req, res, next) => {

  const user = await dbService.findOneAndUpdate({
    model: userModel,
    id: req.user._id,
    data: req.body,
    options: { new: true },
    select: "-password",
  });

  return user ? successResponse({ res, status: 200, data: user }) : next(new AppError(message.user.NotFound, 404));
});


export const updateProfileImage = asyncHandler(async (req, res, next) => {

  await dbService.updateOne({
    model: userModel,
    filter: { _id: req.user._id },
    data: { image: req.file.finalPath },
  });

  return successResponse({ res, status: 200, data: { file: req.file } });
});

export const updateCoverImage = asyncHandler(async (req, res, next) => {

  await dbService.updateOne({
    model: userModel,
    filter: { _id: req.user._id },
    data: { coverImages: req.files.map(file => file.finalPath) },
  });

  return successResponse({ res, status: 200, data: { file: req.file } });
});

