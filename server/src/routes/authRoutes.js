// src/routes/authRoutes.js

const express = require('express');
const router = express.Router();

// Import the controller functions
const {
    registerUser,
    loginUser
} = require('../controllers/authController');

// -------------------------------------------------------------------------
// Route Definitions for Authentication
// -------------------------------------------------------------------------

/**
 * Route: POST /register
 * Maps to the registerUser controller function.
 */
router.post('/register', registerUser);

/**
 * Route: POST /login
 * Maps to the loginUser controller function.
 */
router.post('/login', loginUser);


// Export the router to be used in app.js
module.exports = router;