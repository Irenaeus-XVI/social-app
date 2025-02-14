import { userModel } from "../../../database/model/index.js";
import { AppError } from "../../../utils/appError.js";
import { compareHash, generateHash } from "../../../utils/security/index.js";
import { asyncHandler } from "../../../utils/response/error.response.js";
import { emailEvent } from "../../../utils/events/email.event.js";
import { successResponse } from "../../../utils/response/success.response.js";
import { message } from "../../../common/constants/index.js";


export const register = asyncHandler(async (req, res, next) => {
  const { userName, email, password } = req.body;
  try {

    const isExist = await userModel.findOne({ email });
    console.log(isExist);
    if (isExist) {
      return next(new AppError(message.user.AlreadyExists, 409));
    }

    const hashPassword = generateHash({ password });

    const user = await userModel.create({ userName, email, password: hashPassword });

    emailEvent.emit("sendConfirmEmail", { email });

    return successResponse({ res, status: 201, data: user, message: message.user.CreatedSuccess });
  } catch (error) {
    return res.status(400).send(error);
  }
});


export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { email, code } = req.body;
  try {

    const isExist = await userModel.findOne({ email });
    console.log(isExist);
    if (!isExist) {
      return next(new AppError(message.user.NotFound, 404));
    }

    if (isExist.confirmEmail) {
      return next(new AppError(message.user.Confirmed, 409));
    }
    console.log(code);

    const isMatch = compareHash({ plainText: code, hash: isExist.confirmEmailOTP });
    if (!isMatch) {
      return next(new AppError(message.user.InvalidOTP, 400));
    }

    await userModel.updateOne({ email }, { confirmEmail: true, $unset: { confirmEmailOTP: 0 } });

    return successResponse({ res, status: 200, message: message.user.ConfirmedSuccess });
  } catch (error) {
    return res.status(400).send(error);
  }
}); 