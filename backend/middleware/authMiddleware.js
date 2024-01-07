import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/userModel.js';

//Protect routes
const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Read JWT from the cookie
    token = req.cookies.jwt;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // decoded jwt from the defined in userController.js
            req.user = await User.findById(decoded.userId).select('-password'); // mongoose method to exclude a field from the returned object
            next();
        } catch (error) {
            console.log(`ERROR HERE: `, error);
            res.status(401);
            throw new Error('Authorization failed: incorrect token');
        }
    } else {
        res.status(401);
        throw new Error('Authorization failed: no token');
    }
});

// Admin middleware
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error('Authorization failed: not admin');
    }
};

export { protect, admin };