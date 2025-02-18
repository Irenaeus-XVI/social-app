import connectDb from "../src/database/connection.js";
import { globalErrorHandling } from "./middleware/index.js";
import authController from "./modules/auth/auth.controller.js";
import userController from "./modules/user/user.controller.js";
import postController from "./modules/post/post.controller.js";
import cors from 'cors';
import path from 'node:path';
import rateLimit from "express-rate-limit";
import { AppError } from "./utils/appError.js";
import { message } from "./common/constants/messages.constants.js";
import helmet from "helmet";
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (req, res, next) => {
    return next(new AppError(message.common.tooManyRequest, 429));
  },
  legacyHeaders: true,
  standardHeaders: 'draft-8',
});
const bootstrap = (app, express) => {
  app.use(cors());
  app.use(helmet());
  app.use('/post', limiter);
  app.use('/uploads', express.static(path.resolve('./src/uploads')));
  app.use(express.json());
  app.get('/', (req, res) => res.send('Hello World!'))

  app.use('/auth', authController);
  app.use('/user', userController);
  app.use('/post', postController);
  app.all('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

  app.use(globalErrorHandling);
  connectDb();
}

export default bootstrap;