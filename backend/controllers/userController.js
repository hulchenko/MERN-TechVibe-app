import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

// Register User
// POST /api/users/login
// Public

const registerUser = asyncHandler(async (req, res) => {
    res.send('register user');
});

// Auth user & get token
// POST /api/users/login
// Public

const authUser = asyncHandler(async (req, res) => {
    console.log(`Incoming obj: `, req?.body);
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' }); //create token. Args: payload, secret, expiration

        //Set JWT as HTTP-Only cookie
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development', //this is for HTTPS which is not possible in localhost
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days in ms
        });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});


// Log out the user / clear cookies
// POST /api/users/logout
// Private

const logoutUser = asyncHandler(async (req, res) => {
    res.send('logout user');
});

// Get user profile
// GET /api/users/profile
// Private

const getUserProfile = asyncHandler(async (req, res) => {
    res.send('get user profile');
});


// Update user profile
// PUT /api/users/profile <- Token will be used, :id is not required
// Private

const updateUserProfile = asyncHandler(async (req, res) => {
    res.send('update user profile');
});


// Get users
// GET /api/users
// Private (admin action)

const getUsers = asyncHandler(async (req, res) => {
    res.send('get all users');
});


// Get user by id
// GET /api/users/:id
// Private (admin action)

const getUser = asyncHandler(async (req, res) => {
    res.send('get user by ID');
});

// Update user by id
// PUT /api/users/:id
// Private (admin action)

const updateUser = asyncHandler(async (req, res) => {
    res.send('update user by ID');
});


// Delete users
// DELETE /api/users/:id
// Private (admin action)

const deleteUser = asyncHandler(async (req, res) => {
    res.send('delete user');
});

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    getUser,
    updateUser,
    deleteUser
};
