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
            taxAmount,
            user: req.user._id
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
        // -----------------------------
        // 1. Filtering Logic
        // -----------------------------
        
        let query = { user: req.user._id }; // Base query object

        // Check for 'category' query parameter
        if (req.query.category) {
            // Case-insensitive exact match filtering
            query.category = req.query.category;
        }
        
        // You can extend 'query' here for other fields like description (using regex)

        // -----------------------------
        // 2. Pagination Logic
        // -----------------------------
        
        // Parse pagination parameters, setting defaults
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 5;
        const startIndex = (page - 1) * limit;

        // Calculate total documents matching the filter criteria
        const totalCount = await Expense.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limit);

        // Fetch expenses applying filter, skip, and limit
        const expenses = await Expense.find(query)
            .skip(startIndex)
            .limit(limit)
            .sort({ createdAt: -1 }); // Optional: sort by newest first

        // -----------------------------
        // 3. Response Structure
        // -----------------------------

        // Pagination result object for the response
        const pagination = {
            currentPage: page,
            limit: limit,
            totalCount: totalCount,
            totalPages: totalPages,
        };

        // Respond with the list of expenses, count, and pagination details
        res.status(200).json({
            success: true,
            ...pagination, // Spread the pagination details into the root object
            data: expenses
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: 'Server Error during fetching expenses'
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
            let expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });


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
        const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });

    if (!expense) {
        // If no expense is found, it's either the wrong ID or the user is not the owner
        return res.status(404).json({
            success: false,
            error: 'Expense not found'
        });
    }

    // Now that we've confirmed ownership, delete it
    await expense.deleteOne(); 

    res.status(200).json({
        success: true,
        message: 'Expense deleted successfully',
        data: {}
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
