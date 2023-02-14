const router = require('express').Router();
const {
  createMovie,
  getMovies,
  deleteMovie,
} = require('../controllers/movies');
const {
  createMovieCelebrate, deleteMovieCelebrate,
} = require('../utils/celebrate');

router.get('/', getMovies);
router.post('/', createMovieCelebrate, createMovie);
router.delete('/:movieId', deleteMovieCelebrate, deleteMovie);

module.exports = router;
