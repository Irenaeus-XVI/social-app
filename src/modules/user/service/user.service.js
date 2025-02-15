import { asyncHandler } from "../../../utils/response/index.js";
import { successResponse } from "../../../utils/response/index.js";

export const profile = asyncHandler(async (req, res, next) => {
  const { password, ...userWithoutPassword } = req.user;
  return successResponse({ res, status: 200, data: userWithoutPassword });
});