import express from "express"
import cors from "cors"
import 'dotenv/config'
import logger from './utils/logger.js';
import mainRouter from './routes/index.js';
import errorMiddleware from "./middlewares/error.middleware.js";
import { apiLimiter } from "./middlewares/rateLimit.middleware.js";

const app = express();
const PORT = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use('/api', apiLimiter);

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Welcome to POS API' });
});

app.use('/api', mainRouter);

app.use(errorMiddleware);


app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server is running on port ${PORT}`);
});