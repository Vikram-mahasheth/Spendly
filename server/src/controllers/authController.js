
// src/controllers/authController.js

// src/controllers/authController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken

// -------------------------------------------------------------------------
// Helper Function: Generate JWT
// -------------------------------------------------------------------------

/**
 * Generates a JSON Web Token (JWT) for the given user ID.
 * @param {string} id - The MongoDB ObjectID of the user.
 * @returns {string} The signed JWT.
 */
const generateToken = (id) => {
    // Check if secret is available
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables.');
    }

    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token expires in 30 days
    });
};


/**
 * @desc    Log in a user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please enter username and password' 
            });
        }
        
        const lowerUsername = username.toLowerCase();

        // 1. Find user and explicitly select password hash
        const user = await User.findOne({ username: lowerUsername }).select('+password');

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // 2. Check password using the model's matchPassword method
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // 3. Password verified - Generate JWT token
        const token = generateToken(user._id);

        // 4. Successful login: Return user data and the token
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                _id: user._id,
                username: user.username,
                token: token, // <-- JWT returned here
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Server Error during login' 
        });
    }
};

// Ensure registerUser is still exported (unchanged)
exports.registerUser = async (req, res) => {
    // ... (rest of the registerUser function)
};

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
exports.registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Basic validation
        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide both username and password' 
            });
        }
        
        // Ensure username is converted to lowercase for consistent checking
        const lowerUsername = username.toLowerCase();

        // 2. Check if user already exists
        const userExists = await User.findOne({ username: lowerUsername });

        if (userExists) {
            return res.status(400).json({ 
                success: false, 
                message: 'User already exists' 
            });
        }

        // 3. Create the new user (hashing handled by pre-save hook in the model)
        const user = await User.create({
            username: lowerUsername,
            password,
        });

        // 4. Return success response (select: false ensures password is not included)
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                _id: user._id,
                username: user.username,
                createdAt: user.createdAt,
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Server Error during registration' 
        });
    }
};


