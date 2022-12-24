const Movie = require('../models/movie');
const {
  SUCCESS_DATA_CODE, CAST_ERROR_MESSAGE,
} = require('../utils/constants');

const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({}).populate(['owner'])
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const ownerId = req.user._id;
  Movie.findById(req.params.cardId)
    .orFail(new NotFoundError(`Карточка с id ${req.params.cardId} не найдена`))
    .then((card) => {
      if (card.owner._id.toString() === ownerId) {
        card.delete()
          .then(() => res.status(SUCCESS_DATA_CODE).json({ message: `Карточка с id ${req.params.cardId} удалена` }));
      } else {
        throw new ForbiddenError('Это чужая карточка');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(CAST_ERROR_MESSAGE));
      } else {
        next(err);
      }
    });
};
