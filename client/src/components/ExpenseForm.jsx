// src/components/ExpenseForm.jsx

import React, { useState, useEffect } from 'react';
import './ExpenseForm.css';

const CATEGORY_OPTIONS = ['Food', 'Travel', 'Office Supplies', 'Other'];

/**
 * Reusable form component for creating or editing an expense.
 */
const ExpenseForm = ({ onSubmit, buttonText, initialData = {} }) => {
  
    // CORRECTED STATE INITIALIZATION:
    // We initialize the state directly from `initialData`. This is simpler and avoids the buggy effect.
    const [description, setDescription] = useState(initialData.description || '');
    const [baseAmount, setBaseAmount] = useState(initialData.baseAmount || '');
    const [taxAmount, setTaxAmount] = useState(initialData.taxAmount || '');
    const [category, setCategory] = useState(initialData.category || CATEGORY_OPTIONS[0]);

    // The buggy useEffect hook has been removed.

    const handleSubmit = (e) => {
        e.preventDefault();

        const expenseData = {
            description,
            baseAmount: parseFloat(baseAmount) || 0, // Add fallback to 0
            taxAmount: parseFloat(taxAmount) || 0, // Add fallback to 0
            category,
        };

        onSubmit(expenseData);
    };

    return (
        <form onSubmit={handleSubmit} className="expense-form">
            <div className="form-group">
                <label htmlFor="description">Description (Required)</label>
                <input
                    id="description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                >
                    {CATEGORY_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            </div>

            <div className="amount-group">
                <div className="form-group-half">
                    <label htmlFor="baseAmount">Base Amount ($)</label>
                    <input
                        id="baseAmount"
                        type="number"
                        min="0"
                        step="0.01"
                        value={baseAmount}
                        onChange={(e) => setBaseAmount(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group-half">
                    <label htmlFor="taxAmount">Tax Amount ($)</label>
                    <input
                        id="taxAmount"
                        type="number"
                        min="0"
                        step="0.01"
                        value={taxAmount}
                        onChange={(e) => setTaxAmount(e.target.value)}
                        required
                    />
                </div>
            </div>

            <button type="submit" className="button">
                {buttonText || 'Submit'}
            </button>
        </form>
    );
};

export default ExpenseForm;