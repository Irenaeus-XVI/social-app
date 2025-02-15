import connectDb from "../src/database/connection.js";
import { globalErrorHandling } from "./middleware/index.js";
import authRouter from "./modules/auth/auth.controller.js";
import cors from 'cors';
const bootstrap = (app, express) => {
  app.use(cors());
  app.use(express.json());
  app.get('/', (req, res) => res.send('Hello World!'))

  app.use('/auth', authRouter);

  app.all('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

  app.use(globalErrorHandling);
  connectDb();
}

export default bootstrap;