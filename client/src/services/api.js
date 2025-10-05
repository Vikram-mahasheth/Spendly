// src/services/api.js

import axios from 'axios';

// ---------------------------------------------------------------------
// 1. Axios Instance Configuration
// ---------------------------------------------------------------------

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---------------------------------------------------------------------
// 2. Authentication Functions
// ---------------------------------------------------------------------

/**
 * Logs in a user.
 * @param {object} credentials - { username, password }
 */
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    // Re-throw error to be handled by the component
    throw error.response ? error.response.data : error;
  }
};

/**
 * Registers a new user.
 * @param {object} userData - { username, password }
 */
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};


// ---------------------------------------------------------------------
// 3. Expense Functions (CRUD)
// ---------------------------------------------------------------------

/**
 * Fetches expenses from the API, optionally applying filtering/pagination.
 * @param {string} token - The user's JWT.
 * @param {object} params - Optional query parameters ({ category, page, limit })
 */
export const fetchExpenses = async (token, params = {}) => {
  try {
    const response = await api.get('/expenses', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: params,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

/**
 * Creates a new expense record.
 * @param {object} expenseData - The expense object to be created.
 * @param {string} token - The user's JWT.
 */
export const createExpense = async (expenseData, token) => {
  try {
    const response = await api.post('/expenses', expenseData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

/**
 * UPDATES an existing expense record.
 * @param {string} id - The ID of the expense to update.
 * @param {object} expenseData - The updated data.
 * @param {string} token - The user's JWT.
 */
export const updateExpense = async (id, expenseData, token) => {
  try {
    const response = await api.put(`/expenses/${id}`, expenseData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

/**
 * DELETES an expense record.
 * @param {string} id - The ID of the expense to delete.
 * @param {string} token - The user's JWT.
 */
export const deleteExpense = async (id, token) => {
  try {
    const response = await api.delete(`/expenses/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Usually returns a success message
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
