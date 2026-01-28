const jwt = require('jsonwebtoken');
const User = require('../models/User');


// Auth middeleware function
const auth = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        // If token not available
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "You are not allowed to view this content!"
            })
        }

        // If invalid token format
        if (!token.startsWith("Bearer")) {
            return res.status(401).json({
                success: false,
                message: "Invalid token format!",
            })
        }

        token = token.split(' ')[1];
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decode.id).select('_id name email avatar isOnline lastSeen createdAt role');
        req.user = user;
        next();


    } catch (error) {
        console.log("Error in auth!", error);
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
}

// Catch user to check if user is owner or not
const catchUser = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        // If there is a token, try to identify the user
        if (token && token.startsWith("Bearer")) {
            token = token.split(' ')[1];
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decode.id).select('_id name email helpPoints');
            req.user = user; 
        }
        // Always move to next(), even if no token is found
        next();
    } catch (error) {
        // If token is invalid/expired, we don't care, let them browse as a guest
        next();
    }
}

module.exports = { auth, catchUser }
