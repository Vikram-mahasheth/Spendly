// src/controllers/expenseController.js

const Expense = require('../models/Expense');

/**
 * @desc    Create a new expense
 * @route   POST /api/v1/expenses
 * @access  Public (for now)
 */
exports.createExpense = async (req, res) => {
    try {
        // Extract required fields from the request body
        const { description, category, isReimbursable, baseAmount, taxAmount } = req.body;

        // Create the new expense document
        const newExpense = await Expense.create({
            description,
            category,
            isReimbursable,
            baseAmount,
            taxAmount
        });

        // Respond with the newly created resource and 201 status
        res.status(201).json({
            success: true,
            data: newExpense
        });

    } catch (error) {
        // Handle Mongoose validation errors or other server errors
        res.status(400).json({ 
            success: false, 
            error: error.message || 'Server Error' 
        });
    }
};


/**
 * @desc    Get all expenses
 * @route   GET /api/v1/expenses
 * @access  Public (for now)
 */
exports.getExpenses = async (req, res) => {
    try {
        // Fetch all expenses
        const expenses = await Expense.find();

        // Respond with the list of expenses and 200 status
        res.status(200).json({
            success: true,
            count: expenses.length,
            data: expenses
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Server Error' 
        });
    }
};


/**
 * @desc    Update an existing expense
 * @route   PUT /api/v1/expenses/:id
 * @access  Public (for now)
 */
exports.updateExpense = async (req, res) => {
    try {
        // Find the expense by ID from the URL parameters (req.params.id)
        let expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({
                success: false,
                error: 'Expense not found'
            });
        }

        // Update the document. 
        // { new: true } returns the updated document instead of the original.
        // { runValidators: true } ensures Mongoose runs the schema validators on the update data.
        expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: expense
        });

    } catch (error) {
        // Handle CastError (invalid ID format) or Validation Errors
        if (error.name === 'CastError') {
             return res.status(404).json({ success: false, error: 'Invalid Expense ID format.' });
        }
        res.status(400).json({ 
            success: false, 
            error: error.message || 'Server Error' 
        });
    }
};


/**
 * @desc    Delete an expense
 * @route   DELETE /api/v1/expenses/:id
 * @access  Public (for now)
 */
exports.deleteExpense = async (req, res) => {
    try {
        // Find the expense by ID from the URL parameters
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({
                success: false,
                error: 'Expense not found'
            });
        }

        // Delete the document
        await expense.deleteOne(); 

        // Respond with 200 and a message (or 204 No Content for standard practice)
        res.status(200).json({
            success: true,
            message: 'Expense deleted successfully',
            data: {} // Return empty object for deleted resource
        });

    } catch (error) {
         if (error.name === 'CastError') {
             return res.status(404).json({ success: false, error: 'Invalid Expense ID format.' });
        }
        res.status(500).json({ 
            success: false, 
            error: 'Server Error' 
        });
    }
};
