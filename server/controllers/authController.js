const asyncWrapper = require('../utils/asyncWrapper');
const User = require('../models/User');
const ErrorHandlerClass = require('../utils/ErrorHandlerClass');
const generateToken = require('../utils/generateToken');
const cloudinary = require('cloudinary').v2;
const getDataUri = require('../utils/dataUri');

// User registration/signup
const register = asyncWrapper(async (req, res, next) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return next(new ErrorHandlerClass('User already exists', 400));
    }

    // Initialize empty avatar data
    let avatarData = {
        public_id: "",
        url: ""
    };

    // If file is uploaded, send it to cloudinary
    if (req.file) {
        const fileUri = getDataUri(req.file);
        const myCloud = await cloudinary.uploader.upload(fileUri.content, {
            folder: "skillswap_avatars",
        });

        avatarData = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        };
    }

    const user = await User.create({
        name,
        email,
        password,
        avatar: avatarData
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

// Get current user profile
const getMe = asyncWrapper(async (req, res, next) => {

    // Find user by ID
    const user = await User.findById(req.user._id);

    // If user not found in database
    if (!user) {
        return next(new ErrorHandlerClass("User not found!", 404));
    }

    // Success response
    return res.status(200).json({
        success: true,
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
    getMe,
};