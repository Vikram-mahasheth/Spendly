// src/models/Expense.js

const mongoose = require('mongoose');

// Define the valid categories for the expense
const CATEGORY_ENUM = ['Food', 'Travel', 'Office Supplies', 'Other'];

// -------------------------------------------------------------------------
// Expense Schema Definition
// -------------------------------------------------------------------------

const ExpenseSchema = new mongoose.Schema({
    // 1. description: Required String
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User', // This links it to the User model
        required: true
    },
    description: {
        type: String,
        required: [true, 'Description is required.'],
        trim: true, // Removes whitespace from both ends of a string
        maxlength: [200, 'Description cannot be more than 200 characters.']
    },

    // 2. category: Required Enum String with Default
    category: {
        type: String,
        required: [true, 'Category is required.'],
        enum: {
            values: CATEGORY_ENUM,
            message: 'Category must be one of: Food, Travel, Office Supplies, or Other.'
        },
        default: 'Other'
    },

    // 3. isReimbursable: Boolean with Default
    isReimbursable: {
        type: Boolean,
        default: false
    },

    // 4. baseAmount: Required Number (must be non-negative)
    baseAmount: {
        type: Number,
        required: [true, 'Base amount is required.'],
        min: [0, 'Base amount cannot be negative.']
    },

    // 5. taxAmount: Required Number (must be non-negative)
    taxAmount: {
        type: Number,
        required: [true, 'Tax amount is required.'],
        min: [0, 'Tax amount cannot be negative.']
    },
},
// 6. Timestamps
{
    // Adds 'createdAt' and 'updatedAt' fields automatically
    timestamps: true 
});


// -------------------------------------------------------------------------
// Virtual Property (Optional but highly recommended)
// -------------------------------------------------------------------------

/**
 * Defines a virtual property 'totalAmount' which is the sum of baseAmount and taxAmount.
 * This is not stored in the database but calculated on retrieval.
 */
ExpenseSchema.virtual('totalAmount').get(function() {
    return this.baseAmount + this.taxAmount;
});


// -------------------------------------------------------------------------
// Model Creation and Export
// -------------------------------------------------------------------------

const Expense = mongoose.model('Expense', ExpenseSchema);

module.exports = Expense;