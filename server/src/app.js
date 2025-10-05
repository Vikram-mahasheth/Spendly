// src/app.js

// =========================================================================
// 1. Module Imports and Configuration
// =========================================================================
const express = require('express');
const connectDB = require('./config/database');
const expenseRoutes = require('./routes/expenseRoutes');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
require('dotenv').config();

// =========================================================================
// 2. Connect to Database
// =========================================================================
connectDB();

// =========================================================================
// 3. Initialize Express App
// =========================================================================
const app = express();

// =========================================================================
// 4. CORS Configuration
// =========================================================================
// Only allow requests from your frontend and localhost (for dev)
const allowedOrigins = [
  process.env.FRONTEND_URL, // deployed frontend URL
  'http://localhost:5173'   // local dev frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed from this origin'));
    }
  },
  credentials: true
}));

// =========================================================================
// 5. Middleware
// =========================================================================
app.use(express.json()); // Parse JSON bodies

// =========================================================================
// 6. Routes
// =========================================================================
app.get('/', (req, res) => {
  res.status(200).json({
    message: "API is running successfully",
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use('/api/v1/expenses', expenseRoutes);
app.use('/api/v1/auth', authRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

// =========================================================================
// 7. Start Server
// =========================================================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Running in ${process.env.NODE_ENV || 'development'} mode`);
});

// Export app for testing
module.exports = app;