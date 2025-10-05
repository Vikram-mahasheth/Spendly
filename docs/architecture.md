# Application Architecture

This document outlines the technical architecture of the Expense Tracker application, including the database schema and the project's module breakdown, as required for the submission.

## 1. Database Schema

The application uses a MongoDB database with two primary data models managed by Mongoose.

### User Schema (`/server/src/models/User.js`)

Defines the structure for user documents, focusing on authentication and security.

* **username**: `String`
    * Required, unique, and stored in lowercase to ensure consistency.
* **password**: `String`
    * Required. This field is never stored in plain text. It is automatically hashed using `bcryptjs` via a Mongoose pre-save hook before being saved to the database. It is also configured with `select: false` so it is not returned in API responses by default.

### Expense Schema (`/server/src/models/Expense.js`)

Defines the structure for expense documents. Each expense is explicitly linked to a user to ensure data privacy.

* **user**: `ObjectId`
    * A required reference to the `User` who owns the expense. This is the key to the multi-user security model.
* **description**: `String`
    * [cite_start]A required text field describing the expense[cite: 25].
* **category**: `String`
    * [cite_start]A required enum field, restricted to the values: 'Food', 'Travel', 'Office Supplies', or 'Other'[cite: 26].
* **isReimbursable**: `Boolean`
    * [cite_start]A boolean flag, defaulting to `false`[cite: 27].
* **baseAmount**: `Number`
    * A required number representing the pre-tax cost.
* **taxAmount**: `Number`
    * A required number representing the tax cost.
* **totalAmount**: `Virtual`
    * [cite_start]A calculated field (not stored in the DB) that returns the sum of `baseAmount` and `taxAmount`[cite: 28].
* **timestamps**: `Boolean`
    * Automatically adds `createdAt` and `updatedAt` fields to each document.

## 2. Project Structure / Module Breakdown

The project is a full-stack application organized into a `server` (backend) and `client` (frontend).

### Backend (`/server`)

The Node.js/Express backend follows a modular, service-oriented architecture.

* **/config**: Handles initial configurations, specifically the database connection logic.
* **/controllers**: Contains the core business logic. Functions here handle incoming requests, interact with the models, and send responses.
* **/middleware**: Holds functions that run during the request-response cycle, most importantly the `authMiddleware.js` which protects routes by validating JWTs.
* **/models**: Defines the Mongoose schemas for our database collections.
* **/routes**: Defines the API endpoints (e.g., `/api/v1/expenses`) and maps them to the appropriate controller functions.
* **app.js**: The main entry point for the Express application which loads all configurations, middleware, and routers.

### Frontend (`/client`)

The React frontend is built with Vite and structured for scalability.

* **/src/components**: Contains reusable UI components that are not tied to a specific page, like our `ExpenseForm.jsx`.
* **/src/pages**: Contains top-level components that represent a full view or page, such as `LoginPage.jsx` and `DashboardPage.jsx`.
* **/src/context**: Manages global state. `AuthContext.jsx` is used here to provide authentication status and functions to the entire application.
* **/src/hooks**: Contains custom React hooks for reusable logic, such as our `useDebounce.js` for search optimization.
* **/src/services**: Provides a dedicated layer for all API communication with the backend. `api.js` centralizes all `axios` calls.