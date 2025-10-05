// src/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Import bcryptjs

// -------------------------------------------------------------------------
// User Schema Definition
// -------------------------------------------------------------------------

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required.'],
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: [50, 'Username cannot exceed 50 characters.']
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        select: false 
    },
}, 
{
    timestamps: true 
});

// -------------------------------------------------------------------------
// 1. Mongoose Pre-Save Hook (Password Hashing)
// -------------------------------------------------------------------------

/**
 * Middleware executed BEFORE saving the user document.
 * Checks if the password field has been modified (i.e., new user or password change).
 * If modified, it hashes the password using bcryptjs.
 */
UserSchema.pre('save', async function(next) {
    // Only run this function if the password was actually modified
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Generate a salt (recommended 10-12 rounds for production)
        const salt = await bcrypt.genSalt(10);
        
        // Hash the password using the generated salt
        this.password = await bcrypt.hash(this.password, salt);
        
        next();
    } catch (err) {
        next(err); // Pass error to Mongoose error handler
    }
});


// -------------------------------------------------------------------------
// 2. Schema Method (Password Comparison)
// -------------------------------------------------------------------------

/**
 * Custom instance method to compare an incoming plaintext password with 
 * the hashed password stored in the database.
 * 
 * @param {string} enteredPassword - The plaintext password provided by the user.
 * @returns {Promise<boolean>} - True if passwords match, false otherwise.
 */
UserSchema.methods.matchPassword = async function(enteredPassword) {
    // Use bcrypt.compare() to check the plaintext password against the hash
    return await bcrypt.compare(enteredPassword, this.password);
};


// -------------------------------------------------------------------------
// Model Creation and Export
// -------------------------------------------------------------------------

const User = mongoose.model('User', UserSchema);

module.exports = User;

