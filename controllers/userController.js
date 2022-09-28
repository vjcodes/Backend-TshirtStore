const User = require('../models/user')
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require('../utils/customError');
const cookieToken = require('../utils/cookieToken');
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary');
const mailHelper = require('../utils/emailHelper');
const crypto = require('crypto')

exports.signup = BigPromise(async (req, res, next) => {

    // let result;

    if(!req.files) {
        return next(new CustomError("photo is required for signup", 400))
    }

    const {name, email, password} = req.body

    if(!email || !name || !password){
        return next(new CustomError('Name, email and password are required', 400))

        //or
        // return next(new Error("please send email"))
    }

    let file = req.files.photo;

    const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
        folder: "users",
        width: 150,
        crop: "scale"
    })

    const user = await User.create({
        name,
        email,
        password,
        photo: {
            id: result.public_id,
            secure_url: result.secure_url
        }
    })

    cookieToken(user, res)

});

exports.login = BigPromise(async (req,res,next) => {
    const {email, password} = req.body

    //check for presence of email and password
    if(!email || !password){
        return next(new CustomError("Please provide and email", 400))
    }

    // get user from db
    const user = await User.findOne({email}).select("+password")

    // if user not found in db
    if(!user) {
        return next(new CustomError('Email or Password does not match or exist', 400))
    }

    // match the password
    const isPasswordCorrect = await user.isValidatedPassword(password)

    // if password do not match
    if(!isPasswordCorrect) {
        return next(new CustomError('Email or Password does not match or exist', 400))
    }

    // if all goes good and we send the token
    cookieToken(user, res);
})

exports.logout = BigPromise(async (req,res,next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "Logout success"
    })
})

exports.forgotPassword = BigPromise(async (req,res,next) => {
    const {email} = req.body

    const user = await User.findOne({email})

    if(!user){
        return next(new CustomError('Email not found as registered', 400))
    }

    const forgotToken = user.getForgotPasswordToken()

    await user.save({validateBeforSave: false})

    const myUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${forgotToken}`

    const message = `Copy paste this link in your URL and hit enter \n\n ${myUrl} `

    try {
        const option = {
            email: user.email,
            subject: "LCO TStore - Password reset email",
            message
        }
        await mailHelper(option)

        res.status(200).json({
            success: true,
            message: "email sent successfully"
        })
        
    } catch (error) {
        user.forgotPasswordToken = undefined
        user.forgotPasswordExpiry = undefined
        await user.save({validateBeforeSave: false})

        return next(new CustomError(error.message, 500))
    }
})

exports.passwordReset = BigPromise(async (req,res,next) => {
    const token = req.params.token

    const encryToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex')

    const user = await User.findOne({
        encryToken,
        forgotPasswordExpiry: {$gt: Date.now()} // checking for if expiry date is greater(gt) of Date.now()
    })

    if(!user){
        return next(new CustomError('Token is invalid or expired', 400))
    }

    if(req.body.password!=req.body.confirmPassword){
        return next(new CustomError('password and confirm password do not match', 400))
    }

    user.password = req.body.password

    user.forgotPasswordToken = undefined
    user.forgotPasswordExpiry = undefined

    await user.save();

    // send a JSON response or send token
    cookieToken(user, res);

})

exports.getLoggedInUserDetails = BigPromise(async (req,res,next) => {
    //req.user will be added by middleware
    //find user by id
    const user = await User.findById(req.user.id)

    //send response and user id
    res.status(200).json({
        success: true,
        user
    });

})

exports.changePassword = BigPromise(async (req,res,next) => {
    
    const userId = req.user.id

    const user = await User.findById(userId).select("+password")

    const isCorrectOldPassword = await user.isValidatedPassword(req.body.oldPassword)

    if(!isCorrectOldPassword){
        return next(new CustomError('Old Password is incorrect', 400))
    }

    user.password = req.body.newPassword

    await user.save()

    cookieToken(user, res)

})

exports.updateUserDetails = BigPromise(async (req,res,next) => {
    
    // check for email and name in body
    if(!req.body.name || !req.body.email){
        return next(new CustomError('Name and Email are required', 501))
    }

    const newData = {
        name: req.body.name,
        email: req.body.email
    }

    if(req.files) {
        const user = await User.findById(req.user.id)

        const imageId = user.photo.id

        // delete photo on cloudinary
        const response = await cloudinary.v2.uploader.destroy(imageId)

        // upload the new photo
        const result = await cloudinary.v2.uploader.upload(req.files.photo.tempFilePath, {
            folder: "users",
            width: 150,
            crop: "scale"
        });

        newData.photo = {
            id: result.public_id,
            secure_url: result.secure_url
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        user
    })



})

exports.adminAllUsers = BigPromise(async (req,res,next) => {
    
    const users = await User.find()

    res.status(200).json({
        success: true,
        users
    })

})

exports.admingetOneUser = BigPromise(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if(!user) {
        next(new CustomError('No User found', 400))
    }

    res.status(200).json({
        success: true,
        user
    })
})

exports.managerAllUser = BigPromise(async (req,res,next) => {
    
    const users = await User.find({
        role: "user"
    })

    res.status(200).json({
        success: true,
        users
    })

})