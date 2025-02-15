import { Router } from "express";
import { authMiddleware, validateMongoId } from "../../middleware/index.js";
import * as userService from './service/user.service.js';
const router = Router();

router.get("/profile", authMiddleware(), userService.profile);
router.get("/profile/:id", validateMongoId, authMiddleware(), userService.shareProfile);

export default router; 