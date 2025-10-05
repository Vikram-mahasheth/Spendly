// src/pages/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchExpenses, createExpense, updateExpense, deleteExpense } from '../services/api';
import ExpenseForm from '../components/ExpenseForm';
import useDebounce from '../hooks/useDebounce';
import './DashboardPage.css';

const DashboardPage = () => {
    const navigate = useNavigate();
    const { user, token, logout } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [isCreating, setIsCreating] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);

    const [pagination, setPagination] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_LIMIT = 5;

    const [filterCategory, setFilterCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const loadExpenses = async () => {
        if (!token) { setLoading(false); setError("Authentication token not found."); return; }
        setLoading(true);
        setError(null);
        try {
            const params = { page: currentPage, limit: PAGE_LIMIT };
            if (filterCategory) params.category = filterCategory;
            if (debouncedSearchTerm) params.search = debouncedSearchTerm; // <-- THE FIX IS HERE

            const response = await fetchExpenses(token, params);
            setExpenses(response.data);
            setPagination({
                currentPage: response.currentPage,
                totalPages: response.totalPages,
                totalCount: response.totalCount
            });
        } catch (err) {
            console.error('Error fetching expenses:', err);
            setError(err.message || 'Failed to load expense data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadExpenses();
    }, [token, currentPage, filterCategory, debouncedSearchTerm]);

    const handleCreateExpense = async (formData) => {
        try {
            await createExpense(formData, token);
            if (currentPage !== 1) setCurrentPage(1); else loadExpenses();
            setIsCreating(false);
        } catch (err) { setError("Failed to create expense."); }
    };
    
    const handleUpdateExpense = async (formData) => {
        try {
            await updateExpense(editingExpense._id, formData, token);
            loadExpenses();
            setEditingExpense(null);
        } catch (err) { setError("Failed to update expense."); }
    };

    const handleDeleteExpense = async (id) => {
        if (window.confirm("Are you sure you want to delete this expense?")) {
            try {
                await deleteExpense(id, token);
                if (expenses.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                } else {
                    loadExpenses();
                }
            } catch (err) { setError("Failed to delete expense."); }
        }
    };
     const handleLogout = () => {
        logout(); // This clears the user state and localStorage
        navigate('/login'); // This redirects the user to the login page
    };

    if (loading) { return <div className="container"><h2>Loading expenses...</h2></div>; }
    if (error) { return <div className="container"><h2 className="error">Error: {error}</h2></div>; }
    if (!user) { return <div className="container"><h2>Please log in to view the dashboard.</h2></div>; }

    return (
        <div className="container">
            <div className="header">
                <h1>Welcome, {user.username}!</h1>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
            <hr className="divider" />
            
            <div className="add-expense-section">
                {!editingExpense && (
                    <button onClick={() => setIsCreating(!isCreating)} className="button-toggle-form">
                        {isCreating ? 'Cancel' : 'Add New Expense'}
                    </button>
                )}
                {isCreating && !editingExpense && <ExpenseForm onSubmit={handleCreateExpense} buttonText="Add Expense" />}
                {editingExpense && (
                    <div className="edit-form-container">
                        <h3>Edit Expense</h3>
                        <ExpenseForm onSubmit={handleUpdateExpense} buttonText="Update Expense" initialData={editingExpense} />
                        <button onClick={() => setEditingExpense(null)} className="button-cancel-edit">Cancel Edit</button>
                    </div>
                )}
            </div>

            <div className="list-header">
                <h3>Your Expenses ({pagination ? pagination.totalCount : 0})</h3>
                <div className="controls-group">
                    <div className="search-controls">
                        <input 
                            type="search"
                            placeholder="Search descriptions..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    <div className="filter-controls">
                        <label htmlFor="category-filter">Filter:</label>
                        <select 
                            id="category-filter"
                            value={filterCategory}
                            onChange={(e) => {
                                setFilterCategory(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="">All</option>
                            <option value="Food">Food</option>
                            <option value="Travel">Travel</option>
                            <option value="Office Supplies">Office Supplies</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
            </div>
            
            {expenses.length === 0 ? (
                <p>No expenses found. Try adjusting your search or filter.</p>
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
                    <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                    <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
                    <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === pagination.totalPages}>Next</button>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;