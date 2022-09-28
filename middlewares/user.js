const User = require('../models/user')
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require('../utils/customError');
const jwt = require('jsonwebtoken')

exports.isLoggedIn = BigPromise(async(req, res, next) => {
    const token = req.cookies.token || req.header("Authorization").replace('Bearer ', "");

    if(!token) {
        return next(new CustomError('Login first to access this page', 401))
    }

    const decoded =jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(decoded.id) // we added a property named user in req

    next();
})