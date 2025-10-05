// src/pages/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchExpenses, createExpense } from '../services/api'; // <-- 1. IMPORT createExpense
import ExpenseForm from '../components/ExpenseForm'; // <-- 2. IMPORT the new form component
import './DashboardPage.css';

const DashboardPage = () => {
    const { user, token, logout } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 3. NEW STATE to toggle form visibility
    const [showForm, setShowForm] = useState(false);

    const loadExpenses = async () => {
        if (!token) {
            setLoading(false);
            setError("Authentication token not found. Please log in.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await fetchExpenses(token);
            setExpenses(response.data);
        } catch (err) {
            console.error('Error fetching expenses:', err);
            const errorMessage = err.message || 'Failed to load expense data.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadExpenses();
    }, [token]);

    // 4. NEW FUNCTION to handle form submission
    const handleCreateExpense = async (formData) => {
        try {
            await createExpense(formData, token);
            // Refresh the expenses list after a successful creation
            loadExpenses();
            // Hide the form
            setShowForm(false);
        } catch (error) {
            console.error("Failed to create expense", error);
            // Optionally, set an error state to show in the UI
            setError("Failed to create expense. Please try again.");
        }
    };

    if (loading && expenses.length === 0) {
        return <div className="container"><h2>Loading expenses...</h2></div>;
    }

    if (error) {
        return (
            <div className="container">
                <h2 className="error">Error: {error}</h2>
            </div>
        );
    }
    
    if (!user) {
        return <div className="container"><h2>Please log in to view the dashboard.</h2></div>;
    }

    return (
        <div className="container">
            <div className="header">
                <h1>Welcome, {user.username}!</h1>
                <button onClick={logout} className="logout-button">
                    Logout
                </button>
            </div>

            <hr className="divider" />

            {/* --- 5. NEW JSX SECTION to show button and form --- */}
            <div className="add-expense-section">
                <button onClick={() => setShowForm(!showForm)} className="button-toggle-form">
                    {showForm ? 'Cancel' : 'Add New Expense'}
                </button>
                {showForm && (
                    <ExpenseForm 
                        onSubmit={handleCreateExpense} 
                        buttonText="Add Expense" 
                    />
                )}
            </div>
            {/* --- END OF NEW SECTION --- */}
            
            <h3>Your Expenses ({expenses.length})</h3>

            {expenses.length === 0 ? (
                <p>You have no expenses recorded yet. Click "Add New Expense" to start.</p>
            ) : (
                <ul className="expense-list">
                    {expenses.map((expense) => (
                        <li key={expense._id} className="expense-item">
                            <div className="item-detail">
                                <strong>{expense.description}</strong>
                                <span className="category-badge">{expense.category}</span>
                            </div>
                            <div className="amount">
                                ${(expense.baseAmount + expense.taxAmount).toFixed(2)}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DashboardPage;