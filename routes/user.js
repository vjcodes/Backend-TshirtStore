const express = require('express');
const { signup, login, logout, forgotPassword, passwordReset, getLoggedInUserDetails, changePassword, updateUserDetails, adminAllUsers } = require('../controllers/userController');
const router = express.Router()
const { isLoggedIn, customRole } = require("../middlewares/user")

router.route('/signup').post(signup);
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/forgotPassword').post(forgotPassword)
router.route("/password/reset/:token").post(passwordReset)
router.route("/userdashboard").get(isLoggedIn, getLoggedInUserDetails)
router.route("/password/update").post(isLoggedIn, changePassword)
router.route("/userdashboard/update").post(isLoggedIn, updateUserDetails)


router.route("/admin/users").get(isLoggedIn, customRole('admin'), adminAllUsers)

module.exports = router;