
// src/routes/expenseRoutes.js

const express = require('express');
const { protect } = require('../middleware/authMiddleware');
// Import the controller functions
const {
    createExpense,
    getExpenses,
    updateExpense,
    deleteExpense
} = require('../controllers/expenseController');

// Initialize the Express Router
const router = express.Router();

// -------------------------------------------------------------------------
// Route Definitions
// -------------------------------------------------------------------------

/**
 * Routes that operate on the collection of expenses (GET all, POST new)
 * 
 * Base URL: /api/v1/expenses
 */
router.route('/').post(protect, createExpense).get(protect, getExpenses);//this line was edited to add protect middleware
router.route('/:id').put(protect, updateExpense).delete(protect, deleteExpense);//same here 


// Export the router to be used in app.js
module.exports = router;
