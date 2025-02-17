import { Router } from "express";
import * as commentService from './service/comment.service.js';
import { authMiddleware, authorizationMiddleware, validation } from "../../middleware/index.js";
import { ROLE } from "../../common/constants/index.js";
import { uploadCloudFile } from "../../utils/multer/cloud.multer.js";
import * as validators from './comment.validation.js';

const router = Router({
  mergeParams: true
});



router.post("/",
  authMiddleware(),
  authorizationMiddleware(ROLE.USER),
  uploadCloudFile().array('attachment', 2),
  validation(validators.createComment),
  commentService.createComment
);
export default router;