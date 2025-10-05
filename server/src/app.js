// src/app.js

// =========================================================================
// 1. Module Imports and Configuration
// =========================================================================

// Import the Express framework
const express = require('express');
const connectDB = require('./config/database');
const expenseRoutes = require('./routes/expenseRoutes');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

// Import dotenv to load environment variables from the .env file
require('dotenv').config();


// Connect to the database
connectDB();




// =========================================================================
// 2. Initialization and Configuration
// =========================================================================

// Initialize the Express application


const app = express();


// Set the port for the server.
// It tries to read the PORT environment variable (e.g., from .env)
// and defaults to 5000 if the environment variable is not set.
const PORT = process.env.PORT || 5000;

app.use(cors());
// Middleware (Basic setup - optional for this boilerplate)
// This line allows Express to parse JSON bodies from incoming requests
app.use(express.json());


// =========================================================================
// 3. Routes Definition
// =========================================================================

/**
 * Basic Home Route '/'
 * Sends a simple JSON response to confirm the API is operational.
 */
app.get('/', (req, res) => {
    // Send a JSON response
    res.status(200).json({
        message: "API is running successfully",
        environment: process.env.NODE_ENV || 'development'
    });
});

// All expense-related routes will be prefixed with /api/v1/expenses
app.use('/api/v1/expenses', expenseRoutes);

// All authentication-related routes will be prefixed with /api/v1/auth
app.use('/api/v1/auth', authRoutes);




// Example of a 404 handler (best practice for boilerplate)
app.use((req, res) => {
    res.status(404).json({
        message: 'Resource not found'
    });
});

// =========================================================================
// 4. Server Start
// =========================================================================

/**
 * Starts the Express server and listens for incoming connections on the defined port.
 */
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    console.log(`Access the API at: http://localhost:${PORT}`);
});

// Export the app (useful for testing frameworks)
module.exports = app;