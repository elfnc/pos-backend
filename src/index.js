import express from "express"
import cors from "cors"
import 'dotenv/config'
import logger from './utils/logger.js';
import mainRouter from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Welcome to POS API' });
});

app.use('/api', mainRouter);

app.use((err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
});


app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server is running on port ${PORT}`);
});