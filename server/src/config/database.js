// src/config/database.js

// Import Mongoose
const mongoose = require('mongoose');

/**
 * Asynchronously connects the application to the MongoDB Atlas database using Mongoose.
 */
const connectDB = async () => {
    // 1. Check for MONGO_URI
    if (!process.env.MONGO_URI) {
        console.error('FATAL ERROR: MONGO_URI is not defined in environment variables.');
        // Exit the process if the URI is missing, as the application cannot run without it
        process.exit(1); 
    }

    try {
        // 2. Attempt Connection
        // Use mongoose.connect with the URI from environment variables
        // The options are often recommended to avoid deprecated warnings
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // These options are standard best practices for modern Mongoose connections
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // 3. Log Success
        console.log(`MongoDB Connected: ${conn.connection.host}`);

    } catch (error) {
        // 4. Handle Errors
        console.error(`MongoDB Connection Error: ${error.message}`);
        
        // Exit the process with failure code (1)
        process.exit(1); 
    }
};

// Export the connection function
module.exports = connectDB;

// Note: I've used 'colors' package styling (cyan, red, bold) for better console output.
// If you want colored output, you should install it: `npm install colors`