

javascript
// src/routes/expenseRoutes.js

const express = require('express');

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
router.route('/')
    .post(createExpense)  // POST /api/v1/expenses -> createExpense
    .get(getExpenses);    // GET /api/v1/expenses -> getExpenses

/**
 * Routes that operate on a single expense resource (GET by ID, PUT, DELETE)
 * 
 * Base URL: /api/v1/expenses/:id
 */
router.route('/:id')
    // We didn't create a specific getExpenseById function, but the pattern is common:
    // .get(getExpenseById) 
    .put(updateExpense)    // PUT /api/v1/expenses/:id -> updateExpense
    .delete(deleteExpense); // DELETE /api/v1/expenses/:id -> deleteExpense


// Export the router to be used in app.js
module.exports = router;
