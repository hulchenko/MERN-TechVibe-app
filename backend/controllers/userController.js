import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/userModel.js';

// Register User
// POST /api/users/login
// Public

const registerUser = asyncHandler(async (req, res) => {
    res.send('register user');
});

// Auth user & get token
// POST /api/users/login
// Public

const loginUser = asyncHandler(async (req, res) => {
    console.log(`Incoming obj: `, req?.body);
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
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
    loginUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    getUser,
    updateUser,
    deleteUser
};
