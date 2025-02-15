import { Router } from "express";
import { authMiddleware } from "../../middleware/index.js";
import * as userService from './service/user.service.js';
const router = Router();

router.get("/profile", authMiddleware(), userService.profile); 

export default router; 