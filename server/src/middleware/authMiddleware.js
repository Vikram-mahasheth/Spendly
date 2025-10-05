const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Need the User model to find the user

/**
 * Middleware function to protect routes by verifying JWT authentication.
 * Checks for a token in the Authorization header.
 */
exports.protect = async (req, res, next) => {
    let token;

    // 1. Check if token exists in the header (Authorization: Bearer TOKEN)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (split "Bearer TOKEN" into array and take the second element)
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify token
            if (!process.env.JWT_SECRET) {
                // This is a safety check; ideally, this error is caught on server startup
                throw new Error('JWT_SECRET is not configured.');
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Find user by ID from the decoded payload
            // We exclude the password explicitly here, although the model defaults to select: false
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Not authorized, user not found' 
                });
            }

            // 4. Attach user to the request object (req.user)
            req.user = user;

            // 5. Continue to the next middleware or controller
            next();

        } catch (error) {
            console.error(error);
            // Handle expired token or invalid signature errors
            return res.status(401).json({ 
                success: false, 
                message: 'Not authorized, token failed or expired' 
            });
        }
    }

    // If no token is provided in the header
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Not authorized, no token provided' 
        });
    }
};
