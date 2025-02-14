import { userModel } from "../../../database/model/index.js";
import { AppError } from "../../../utils/appError.js";
import { compareHash, generateHash, generateToken } from "../../../utils/security/index.js";
import { asyncHandler } from "../../../utils/response/error.response.js";
import { emailEvent } from "../../../utils/events/email.event.js";
import { successResponse } from "../../../utils/response/success.response.js";
import { message, ROLE } from "../../../common/constants/index.js";


export const register = asyncHandler(async (req, res, next) => {
  const { userName, email, password } = req.body;


  const isExist = await userModel.findOne({ email });
  console.log(isExist);
  if (isExist) {
    return next(new AppError(message.user.AlreadyExists, 409));
  }

  const hashPassword = generateHash({ plainText: password });

  const user = await userModel.create({ userName, email, password: hashPassword });

  emailEvent.emit("sendConfirmEmail", { email });

  return successResponse({ res, status: 201, data: user, message: message.user.CreatedSuccess });

});


export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { email, code } = req.body;


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

});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new AppError(message.user.NotFound, 404));
  }

  if (!user.confirmEmail) {
    return next(new AppError(message.user.Verify, 400));
  }

  console.log(user.password, password);

  const isPasswordValid = compareHash({ plainText: password, hash: user.password });
  console.log(isPasswordValid);

  if (!isPasswordValid) {
    return next(new AppError(message.user.Invalid_Credentials, 404));
  }

  const tokenPayload = {
    id: user._id,
    email: user.email,
    role: user.role
  };

  const accessTokenSignature = user.role === ROLE.ADMIN ? process.env.ADMIN_ACCESS_TOKEN : process.env.USER_ACCESS_TOKEN;
  const accessToken = generateToken({
    payload: tokenPayload,
    signature: accessTokenSignature,
  });

  const refreshTokenSignature = user.role === ROLE.ADMIN ? process.env.ADMIN_REFRESH_TOKEN : process.env.USER_REFRESH_TOKEN;
  const refreshToken = generateToken({
    payload: tokenPayload,
    signature: refreshTokenSignature,
    expiresIn: 31536000
  });

  return successResponse({ res, status: 200, data: { access_token: accessToken, refresh_token: refreshToken } });
});
