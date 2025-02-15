import { userModel } from "../../../database/model/index.js";
import { AppError } from "../../../utils/appError.js";
import { compareHash, decodeToken, generateHash, generateToken, verifyToken } from "../../../utils/security/index.js";
import { asyncHandler } from "../../../utils/response/error.response.js";
import { emailEvent } from "../../../utils/events/email.event.js";
import { successResponse } from "../../../utils/response/success.response.js";
import { GOOGLE_PROVIDER, LOCAL_PROVIDER, message, ROLE, TOKEN_TYPES } from "../../../common/constants/index.js";
import { OAuth2Client } from 'google-auth-library';
import * as dbService from "../../../database/db.service.js";

export const register = asyncHandler(async (req, res, next) => {
  const { userName, email, password } = req.body;


  const isExist = await dbService.findOne({ model: userModel, filter: { email } });
  console.log(isExist);
  if (isExist) {
    return next(new AppError(message.user.AlreadyExists, 409));
  }

  const hashPassword = generateHash({ plainText: password });

  const user = await dbService.create({
    model: userModel,
    data: {
      userName, email,
      password: hashPassword,
      provider: LOCAL_PROVIDER
    }
  });

  emailEvent.emit("sendConfirmEmail", { id: user._id, email });

  return successResponse({ res, status: 201, data: user, message: message.user.CreatedSuccess });

});


export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { email, code } = req.body;


  const isExist = await dbService.findOne({ model: userModel, filter: { email } });
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

  await dbService.updateOne({
    model: userModel,
    filter: { email },
    data: { confirmEmail: true, $unset: { confirmEmailOTP: 0 } }
  });

  return successResponse({ res, status: 200, message: message.user.ConfirmedSuccess });

});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await dbService.findOne({ model: userModel, filter: { email, isDeleted: false } });
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

export const googleLogin = asyncHandler(async (req, res, next) => {
  const { idToken } = req.body;
  const client = new OAuth2Client();
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.WEB_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  }
  const payload = await verify();

  if (!payload || !payload.email_verified) {
    return next(new AppError(message.user.Invalid_Credentials, 404));
  }

  let user = await dbService.findOne({ model: userModel, filter: { email: payload.email } });
  if (!user) {
    user = await dbService.create({
      model: userModel,
      data: {
        email: payload.email,
        userName: payload.name,
        confirmEmail: payload.email_verified,
        image: payload.picture,
        provider: GOOGLE_PROVIDER
      }
    });
  }

  if (user.provider !== GOOGLE_PROVIDER) {
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



  return successResponse({ res, status: 200, data: { accessToken, refreshToken } });
});

export const refreshToken = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;

  const user = await decodeToken({ authorization, tokenType: TOKEN_TYPES.REFRESH, next });

  let signature = user.role === ROLE.ADMIN ? process.env.ADMIN_REFRESH_TOKEN : process.env.USER_REFRESH_TOKEN;

  const tokenPayload = {
    id: user._id,
    email: user.email,
    role: user.role
  };


  const accessToken = generateToken({
    payload: tokenPayload,
    signature: signature,
  });

  const refreshToken = generateToken({
    payload: tokenPayload,
    signature: signature,
    expiresIn: 31536000
  });

  return successResponse({ res, status: 200, data: { accessToken, refreshToken } });
});

export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await dbService.findOne({ model: userModel, filter: { email, isDeleted: false } });
  if (!user) {
    return next(new AppError(message.user.NotFound, 404));
  }

  if (!user.confirmEmail) {
    return next(new AppError(message.user.Verify, 400));
  }
  emailEvent.emit("sendForgetPassword", { id: user._id, email });

  return successResponse({ res, status: 200, message: message.user.OTP_Sent });

});

export const validateForgetPasswordCode = asyncHandler(async (req, res, next) => {
  const { email, code } = req.body;

  console.log(email, code);

  const user = await dbService.findOne({ model: userModel, filter: { email, isDeleted: false } });
  if (!user) {
    return next(new AppError(message.user.NotFound, 404));
  }

  if (!user.confirmEmail) {
    return next(new AppError(message.user.Verify, 400));
  }

  const isMatch = compareHash({ plainText: code, hash: user.forgetPasswordOTP });

  if (!isMatch) {
    return next(new AppError(message.user.InvalidOTP, 400));
  }
  return successResponse({ res, status: 200, message: message.user.OTP_Verified });

});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, password, code } = req.body;

  const user = await dbService.findOne({ model: userModel, filter: { email, isDeleted: false } });
  if (!user) {
    return next(new AppError(message.user.NotFound, 404));
  }

  if (!user.confirmEmail) {
    return next(new AppError(message.user.Verify, 400));
  }
  const isMatch = compareHash({ plainText: code, hash: user.forgetPasswordOTP });
  if (!isMatch) {
    return next(new AppError(message.user.InvalidOTP, 400));
  }
  const hashPassword = generateHash({ plainText: password });
  await dbService.updateOne(
    {
      model: userModel,
      filter: { email },
      data: { password: hashPassword, changeCredentialTime: Date.now(), $unset: { forgetPasswordOTP: 0 } }
    }
  );

  return successResponse({ res, status: 200, message: message.user.Password_Updated });

});