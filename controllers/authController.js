const User = require('../models/userModel')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const Email = require('../utils/email')

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

exports.signup = async (req, res, next) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        })
        const token = signToken(newUser._id)
        // console.log(token);
        await new Email(newUser).sendWelcome()
        res.status(200).json({
            status: ' sign up success',
            token,
            data: {
                newUser
            }
        })

    }
    catch (err) {
        res.status(404).json({
            status: 'error',
            message: err.message
        })
    }
}
exports.protect = async (req, res, next) => {
    try {

        let token
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]
        }
        if (!token) {
            throw new Error('Please Login to access this');
        }
        const decoded = (jwt.verify)(token, process.env.JWT_SECRET)
        const currentUser = await User.findById(decoded.id)
        if (!currentUser) {
            throw new Error('User Does not exist');
        }
        req.user = currentUser;
        next();
    }
    catch (err) {
        res.status(404).json({
            status: 'error',
            message: err.message
        })
    }
}
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            throw new Error('Please Provide all the details');
        }
        const user = await User.findOne({ email }).select('+password')
        let correct
        if (user) {
            correct = await user.correctPassword(password, user.password)
        }
        if (!user || !correct) {
            throw new Error('Invalid Credentials');
        }
        const token = signToken(user._id)
        res.status(200).json({
            status: ' Login successfully',
            token,
        })


    }
    catch (err) {
        res.status(404).json({
            status: 'error',
            message: err.message
        })
    }

}

exports.changePassword = async (req, res, next) => {
    try {
        const currentUser = await User.findById(req.user.id).select('+password')
        if (!(await currentUser.correctPassword(req.body.currentPassword, currentUser.password))) {
            throw new Error('Your Password is incorrect');
        }
        currentUser.password = req.body.newPassword
        await currentUser.save()
        const token = signToken(currentUser._id)
        res.status(200).json({
            status: ' password changed successfully',
            token,
        })

    }
    catch (err) {
        res.status(404).json({
            status: 'error',
            message: err.message
        })
    }

}