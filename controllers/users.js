const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BadRequestError = require('../errors/BadRequestError');
const ExistEmailError = require('../errors/ExistEmail');
const NotFoundError = require('../errors/NotFoundError');
const User = require('../models/user');
const {
  SUCCESS_DATA_CODE,
  BAD_DATA_MESSAGE,
  SUCCESS_CREATION_CODE,
  CAST_ERROR_MESSAGE,
  NOT_FOUND_USER_MESSAGE,
  EMAIL_EXIST_ERROR_MESSAGE,
} = require('../utils/constants');

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((document) => {
      const user = document.toObject();
      delete user.password;
      res.status(SUCCESS_CREATION_CODE).send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ExistEmailError(EMAIL_EXIST_ERROR_MESSAGE));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(BAD_DATA_MESSAGE));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  ).orFail(new NotFoundError(NOT_FOUND_USER_MESSAGE))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(BAD_DATA_MESSAGE));
      } else if (err.name === 'CastError') {
        next(new BadRequestError(CAST_ERROR_MESSAGE));
      } else if (err.code === 11000) {
        next(new ExistEmailError(EMAIL_EXIST_ERROR_MESSAGE));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  User.findUserByCredentials(req.body)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'super-secret-key', { expiresIn: '7d' });
      return res.status(SUCCESS_DATA_CODE).send({ token });
    })
    .catch(next);
};

module.exports.userInfo = (req, res, next) => {
  User.findById(
    req.user._id,
  ).orFail(new NotFoundError(NOT_FOUND_USER_MESSAGE))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(CAST_ERROR_MESSAGE));
      } else {
        next(err);
      }
    });
};

module.exports.logout = (req, res) => {
  res.clearCookie('jwt');
  return res.end();
};
