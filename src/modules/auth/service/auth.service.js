import { userModel } from "../../../database/model/index.js";
import { AppError } from "../../../utils/appError.js";
import { generateHash } from "../../../utils/security/index.js";
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
      return next(new AppError("User already exist", 409));
    }

    const hashPassword = generateHash({ password });

    const user = await userModel.create({ userName, email, password: hashPassword });

    emailEvent.emit("sendConfirmEmail", { email });

    return successResponse({ res, status: 201, data: user, message: message.user.CreatedSuccess });
  } catch (error) {
    return res.status(400).send(error);
  }
}); 