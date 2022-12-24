const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const { loginCelebrate, createUserCelebrate } = require('../utils/celebrate');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { notFoundControllers } = require('../controllers/notFoundControllers');

router.post('/signin', loginCelebrate, login);
router.post('/signup', createUserCelebrate, createUser);
router.use(auth);
router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.use('*', notFoundControllers);

module.exports = router;
