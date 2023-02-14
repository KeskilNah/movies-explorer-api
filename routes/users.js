const router = require('express').Router();
const {
  updateUser,
  userInfo,
} = require('../controllers/users');
const { updateUserCelebrate } = require('../utils/celebrate');

router.get('/me', userInfo);
router.patch('/me', updateUserCelebrate, updateUser);

module.exports = router;
