// src/pages/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchExpenses } from '../services/api';
import './DashboardPage.css'; // Import the new CSS file

const DashboardPage = () => {
    const { user, token, logout } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) {
            setLoading(false);
            setError("Authentication token not found. Please log in.");
            return;
        }
        
        const loadExpenses = async () => {
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

        loadExpenses();
    }, [token]);

    if (loading) {
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
            
            <h3>Your Expenses ({expenses.length})</h3>

            {expenses.length === 0 ? (
                <p>You have no expenses recorded yet.</p>
            ) : (
                <ul className="expense-list">
                    {expenses.map((expense) => (
                        <li key={expense._id} className="expense-item">
                            <div className="item-detail">
                                <strong>{expense.description}</strong>
                                <span className="category-badge">{expense.category}</span>
                            </div>
                            <div className="amount">
                                {/* This calculates the total amount on the fly for display */}
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