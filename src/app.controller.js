import connectDb from "../src/database/connection.js";

const bootstrap = (app, express) => {
  app.use(express.json());
  app.get('/', (req, res) => res.send('Hello World!'))



  app.all('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

  connectDb();
}

export default bootstrap;