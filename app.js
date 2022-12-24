require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const routes = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
const app = express();
// const allowedOrigins = [
//   '*',
// ];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(helmet());
app.use(requestLogger);
app.use(limiter);
app.use(cookieParser());
app.use(cors(
  {
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(routes);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT);
