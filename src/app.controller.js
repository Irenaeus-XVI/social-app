import connectDb from "../src/database/connection.js";
import { globalErrorHandling } from "./middleware/index.js";
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/user/user.controller.js";
import cors from 'cors';
import path from 'node:path';
const bootstrap = (app, express) => {
  app.use(cors());
  app.use('/uploads', express.static(path.resolve('./src/uploads')));
  app.use(express.json());
  app.get('/', (req, res) => res.send('Hello World!'))

  app.use('/auth', authRouter);
  app.use('/user', userRouter);
  app.all('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

  app.use(globalErrorHandling);
  connectDb();
}

export default bootstrap;