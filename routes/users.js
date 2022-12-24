const router = require('express').Router();
const {
  getUsers,
  updateUser,
  userInfo,
} = require('../controllers/users');
const { updateUserCelebrate } = require('../utils/celebrate');

router.get('/', getUsers);
router.get('/me', userInfo);
router.patch('/me', updateUserCelebrate, updateUser);

module.exports = router;
