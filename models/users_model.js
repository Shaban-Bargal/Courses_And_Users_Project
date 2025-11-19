const userRoles = require("../utils/user_roles");

const mongoose = require("mongoose");
var validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String
    },
    role: {
        type: String,
        enum: [userRoles.ADMIN, userRoles.USER, userRoles.MANGER],
        default: userRoles.USER ,
    }, 
    avatar: {
        type: String ,
        default: '/uploads/profile.png' 
    }

});

module.exports = mongoose.model("User", userSchema);