import mongoose from "mongoose";
import { message } from "../common/constants/index.js";
import { AppError } from "../utils/appError.js";

export const validateMongoId = (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError(message.user.InvalidId, 400));
  }
  next();
}


