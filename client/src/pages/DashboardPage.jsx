// src/pages/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchExpenses, createExpense, updateExpense, deleteExpense } from '../services/api';
import ExpenseForm from '../components/ExpenseForm';
import './DashboardPage.css';

const DashboardPage = () => {
    const { user, token, logout } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [isCreating, setIsCreating] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);

    // State for pagination
    const [pagination, setPagination] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_LIMIT = 5;

    // --- 1. NEW STATE FOR FILTERING ---
    const [filterCategory, setFilterCategory] = useState(''); // Empty string means 'All'


    // Reusable function to load expenses
    const loadExpenses = async () => {
        if (!token) {
            setLoading(false);
            setError("Authentication token not found. Please log in.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            // Build the params object for the API call
            const params = {
                page: currentPage,
                limit: PAGE_LIMIT,
            };
            if (filterCategory) {
                params.category = filterCategory;
            }

            const response = await fetchExpenses(token, params);
            setExpenses(response.data);
            setPagination({
                currentPage: response.currentPage,
                totalPages: response.totalPages,
                totalCount: response.totalCount
            });
        }
         catch (err) {
            console.error('Error fetching expenses:', err);
            const errorMessage = err.message || 'Failed to load expense data.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Effect to load data on initial render or when page changes
    useEffect(() => {
        loadExpenses();
    }, [token, currentPage,filterCategory]);

    // Handler for creating a new expense
    const handleCreateExpense = async (formData) => {
        try {
            await createExpense(formData, token);
            setCurrentPage(1); // Go back to the first page to see the new item
            loadExpenses();
            setIsCreating(false);
        } catch (err) { setError("Failed to create expense."); }
    };
    
    // Handler for updating an expense
    const handleUpdateExpense = async (formData) => {
        try {
            await updateExpense(editingExpense._id, formData, token);
            loadExpenses();
            setEditingExpense(null);
        } catch (err) { setError("Failed to update expense."); }
    };

    // Handler for deleting an expense
    const handleDeleteExpense = async (id) => {
        if (window.confirm("Are you sure you want to delete this expense?")) {
            try {
                await deleteExpense(id, token);
                // If we delete the last item on a page, go to the previous page
                if (expenses.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                } else {
                    loadExpenses();
                }
            } catch (err) { setError("Failed to delete expense."); }
        }
    };

    if (loading) {
        return <div className="container"><h2>Loading expenses...</h2></div>;
    }

    if (error) {
        return <div className="container"><h2 className="error">Error: {error}</h2></div>;
    }
    
    if (!user) {
        return <div className="container"><h2>Please log in to view the dashboard.</h2></div>;
    }

    return (
        <div className="container">
            <div className="header">
                <h1>Welcome, {user.username}!</h1>
                <button onClick={logout} className="logout-button">Logout</button>
            </div>
            <hr className="divider" />
            
            <div className="add-expense-section">
                {!editingExpense && (
                    <button onClick={() => setIsCreating(!isCreating)} className="button-toggle-form">
                        {isCreating ? 'Cancel' : 'Add New Expense'}
                    </button>
                )}
                
                {isCreating && !editingExpense && (
                    <ExpenseForm onSubmit={handleCreateExpense} buttonText="Add Expense" />
                )}

                {editingExpense && (
                    <div className="edit-form-container">
                        <h3>Edit Expense</h3>
                        <ExpenseForm 
                            onSubmit={handleUpdateExpense} 
                            buttonText="Update Expense"
                            initialData={editingExpense}
                        />
                        <button onClick={() => setEditingExpense(null)} className="button-cancel-edit">Cancel Edit</button>
                    </div>
                )}
            </div>

            <div className="list-header">
                <h3>Your Expenses ({pagination ? pagination.totalCount : 0})</h3>
                <div className="filter-controls">
                    <label htmlFor="category-filter">Filter by Category:</label>
                    <select 
                        id="category-filter"
                        value={filterCategory}
                        onChange={(e) => {
                            setFilterCategory(e.target.value);
                            setCurrentPage(1); // Reset to page 1 when filter changes
                        }}
                    >
                        <option value="">All Categories</option>
                        <option value="Food">Food</option>
                        <option value="Travel">Travel</option>
                        <option value="Office Supplies">Office Supplies</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            <h3>Your Expenses ({pagination ? pagination.totalCount : 0})</h3>
            
            {expenses.length === 0 && !isCreating ? (
                <p>You have no expenses recorded yet. Click "Add New Expense" to start.</p>
            ) : (
                <ul className="expense-list">
                    {expenses.map((expense) => (
                        <li key={expense._id} className="expense-item">
                            <div className="item-detail">
                                <strong>{expense.description}</strong>
                                <span className="category-badge">{expense.category}</span>
                            </div>
                            <div className="item-right-section">
                                <div className="amount">${(expense.baseAmount + expense.taxAmount).toFixed(2)}</div>
                                <div className="item-actions">
                                    <button onClick={() => setEditingExpense(expense)} className="edit-button">Edit</button>
                                    <button onClick={() => handleDeleteExpense(expense._id)} className="delete-button">Delete</button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {pagination && pagination.totalPages > 1 && (
                <div className="pagination-controls">
                    <button 
                        onClick={() => setCurrentPage(currentPage - 1)} 
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <button 
                        onClick={() => setCurrentPage(currentPage + 1)} 
                        disabled={currentPage === pagination.totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;