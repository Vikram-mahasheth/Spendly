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
    
    // State for managing which form to show
    const [isCreating, setIsCreating] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null); // Will hold the expense being edited

    // Function to load expenses, reusable
    const loadExpenses = async () => {
        if (!token) {
            setLoading(false);
            setError("Authentication token not found. Please log in.");
            return;
        }
        // Don't show main loading screen on re-fetch, just let UI update
        // setLoading(true); 
        setError(null);
        try {
            const response = await fetchExpenses(token);
            setExpenses(response.data);
        } catch (err) {
            console.error('Error fetching expenses:', err);
            const errorMessage = err.message || 'Failed to load expense data.';
            setError(errorMessage);
        } finally {
            setLoading(false); // Only set loading false on initial load
        }
    };

    // Initial load effect
    useEffect(() => {
        loadExpenses();
    }, [token]);

    // Handler for creating a new expense
    const handleCreateExpense = async (formData) => {
        try {
            await createExpense(formData, token);
            loadExpenses(); // Refresh the list
            setIsCreating(false); // Hide form on success
        } catch (err) { setError("Failed to create expense."); }
    };
    
    // Handler for updating an expense
    const handleUpdateExpense = async (formData) => {
        try {
            await updateExpense(editingExpense._id, formData, token);
            loadExpenses(); // Refresh the list
            setEditingExpense(null); // Hide form on success
        } catch (err) { setError("Failed to update expense."); }
    };

    // Handler for deleting an expense
    const handleDeleteExpense = async (id) => {
        if (window.confirm("Are you sure you want to delete this expense?")) {
            try {
                await deleteExpense(id, token);
                loadExpenses(); // Refresh the list
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
                {/* Only show the 'Add' button if we are not currently editing another expense */}
                {!editingExpense && (
                    <button onClick={() => setIsCreating(!isCreating)} className="button-toggle-form">
                        {isCreating ? 'Cancel' : 'Add New Expense'}
                    </button>
                )}
                
                {/* Show the CREATE form if isCreating is true and we're not editing */}
                {isCreating && !editingExpense && (
                    <ExpenseForm onSubmit={handleCreateExpense} buttonText="Add Expense" />
                )}

                {/* Show the UPDATE form if an expense has been selected for editing */}
                {editingExpense && (
                    <div className="edit-form-container">
                        <h3>Edit Expense</h3>
                        <ExpenseForm 
                            onSubmit={handleUpdateExpense} 
                            buttonText="Update Expense"
                            initialData={editingExpense} // This pre-fills the form
                        />
                        <button onClick={() => setEditingExpense(null)} className="button-cancel-edit">Cancel Edit</button>
                    </div>
                )}
            </div>

            <h3>Your Expenses ({expenses.length})</h3>
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
        </div>
    );
};

export default DashboardPage;