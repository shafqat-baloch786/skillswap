const asyncWrapper = require('../utils/asyncWrapper');
const User = require('../models/User');
const ErrorHandlerClass = require('../utils/ErrorHandlerClass');
const generateToken = require('../utils/generateToken');

// User registration/signup
const register = asyncWrapper(async (req, res, next) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return next(new ErrorHandlerClass('User already exists', 400));
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    // Generate json web token and add to response
    const token = generateToken(user._id);

    return res.status(201).json({
        success: true,
        message: "User created successfully",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            helpPoints: user.helpPoints,
            avatar: user.avatar
        }
    });
});

// User login/sign in
const login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // If user does not exist in db with this email
    if (!user) {
        return next(new ErrorHandlerClass("User not found!", 404));
    }

    // If entered password does not match with saved one
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandlerClass("Email or password invalid!", 400));
    }

    const token = generateToken(user._id);

    // Success response
    return res.status(200).json({
        success: true,
        message: "User logged in successfully!",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            helpPoints: user.helpPoints,
            avatar: user.avatar
        }
    });
});

module.exports = {
    register,
    login,
};