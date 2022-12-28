const Movie = require('../models/movie');
const {
  SUCCESS_DATA_CODE, BAD_DATA_MESSAGE,
} = require('../utils/constants');

const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id }).populate(['owner'])
    .then((movies) => res.send({ data: movies }))
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
    .then((movies) => res.send({ data: movies }))
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
  Movie.findById(req.params.movieId)
    .orFail(new NotFoundError(`Объект с id ${req.params.movieId} не найден`))
    .then((movie) => {
      if (movie.owner._id.toString() === ownerId) {
        movie.delete()
          .then(() => res.status(SUCCESS_DATA_CODE).json({ message: `Объект с id ${req.params.movieId} удалён` }))
          .catch(next);
      } else {
        throw new ForbiddenError('Это чужой объект');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(BAD_DATA_MESSAGE));
      } else {
        next(err);
      }
    });
};
