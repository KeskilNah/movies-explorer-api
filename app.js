require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const { limiter } = require('./middlewares/limiter');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const DB = process.env.NODE_ENV === 'production' ? process.env.DB : 'mongodb://localhost:27017/bitfilmsdb';

const app = express();
// const allowedOrigins = [
//   '*',
// ];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(DB, {
  useNewUrlParser: true,
});

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
