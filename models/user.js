const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        maxlength: [40, 'Name should be under 40 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        validate: [validator.isEmail, 'Please enter email in correct format'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'password should be atleast 6 char'],
        select: false //now when we access user then password field would not be visible
    },
    role: {
        type: String,
        default: 'user'
    },
    photo: {
        type: {
            id: {
                type: String,
                required: true
            },
            secure_url: {
                type: String,
                required: true
            },
        }
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('User', userSchema)