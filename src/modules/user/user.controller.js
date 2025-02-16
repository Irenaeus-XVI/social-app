import { Router } from "express";
import { authMiddleware, validateMongoId, validation } from "../../middleware/index.js";
import * as userService from './service/user.service.js';
import * as validators from './user.validation.js';
const router = Router();

router.get("/profile", authMiddleware(), userService.profile);
router.get("/profile/:id", validateMongoId, authMiddleware(), userService.shareProfile);
router.patch('/update-email', validation(validators.updateEmail), authMiddleware(), userService.updateEmail);
router.patch('/reset-email', validation(validators.resetEmail), authMiddleware(), userService.resetEmail);
router.patch('/update-password', validation(validators.updatePassword), authMiddleware(), userService.updatePassword);
router.patch('/profile', validation(validators.updateProfile), authMiddleware(), userService.updateProfile);
export default router; 