const express = require('express');
const { signup, login, logout, forgotPassword, passwordReset } = require('../controllers/userController');
const router = express.Router()

router.route('/signup').post(signup);
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/forgotPassword').post(forgotPassword)
router.route("/password/reset/:token").post(passwordReset)


module.exports = router;