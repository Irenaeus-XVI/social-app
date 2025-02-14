import { Router } from 'express';
import * as registerRoutes from './service/auth.service.js';
import * as validators from './auth.validation.js';
import { validation } from '../../middleware/index.js';
const authRouter = Router();

authRouter.post('/register', validation(validators.signup), registerRoutes.register);
authRouter.patch('/confirm-email', validation(validators.confirmEmail), registerRoutes.confirmEmail);
authRouter.post('/login', validation(validators.login), registerRoutes.login);
export default authRouter;  