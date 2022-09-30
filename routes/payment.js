const express = require('express');
const { sendStripeKey, sendRazorPayKey, captureStripePayment, captureRazorpayPayment } = require('../controllers/paymentController');
const router = express.Router()
const { isLoggedIn, customRole } = require("../middlewares/user")

router.route("/stripekey").get(isLoggedIn, sendStripeKey);
router.route("/razorpaykey").get(isLoggedIn, sendRazorPayKey);

router.route("/capturestripe").post(isLoggedIn, captureStripePayment);
router.route("/capturerazorpay").post(isLoggedIn, captureRazorpayPayment);

module.exports = router;