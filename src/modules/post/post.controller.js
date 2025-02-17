import { Router } from "express";
import * as postService from './service/post.service.js';
import { authMiddleware, authorizationMiddleware, validateMongoId, validation } from "../../middleware/index.js";
import * as validator from './post.validation.js';
import { uploadCloudFile } from "../../utils/multer/cloud.multer.js";
import { ROLE } from "../../common/constants/role.constant.js";
const router = Router();


router.post('/',
  authMiddleware(),
  authorizationMiddleware(ROLE.USER),
  uploadCloudFile().array('attachment', 2),
  validation(validator.createPost),
  postService.createPost);


  router.patch('/:id',
  authMiddleware(),
  authorizationMiddleware(ROLE.USER),
  validateMongoId,
  uploadCloudFile().array('attachment', 2),
  validation(validator.updatePost),
  postService.updatePost);

export default router;