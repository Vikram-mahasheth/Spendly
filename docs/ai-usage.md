# AI Usage Documentation

## Prompt 1: Backend Folder Structure

* **Prompt:**
    I'm starting a new project in my server directory using Node.js and Express. What is a standard and scalable folder structure for an Express API that includes routes, controllers, models, and middleware? List the folders and briefly explain the purpose of each.

* **Context:**
    "This was my first prompt... to establish a clean, scalable... architecture..."

* **Response from Gemini:**
    This is a great question. Establishing a clear, scalable folder structure is crucial for maintaining a healthy codebase, especially as your Express API grows.

The structure described below is often referred to as the **MVC-Pattern (Model-View-Controller)**, adapted for an API context, plus dedicated folders for utility and middleware functions.

Here is a standard and scalable folder structure for an Express API:

## Standard Express API Folder Structure

```
project-root/
├── node_modules/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── app.js
├── .env
├── .gitignore
└── package.json
```

---

## Folder and File Explanations

### Core Application Files

| File/Folder | Purpose | Explanation |
| :--- | :--- | :--- |
| `src/` | **Source Code** | Contains all the application logic. Separating source code into a `src` directory keeps the root tidy. |
| `src/app.js` | **Entry Point** | The main file that initializes the Express application, sets up middleware, connects to the database, and loads the routes. |
| `package.json` | **Metadata** | Defines project dependencies, scripts (e.g., `start`, `dev`), and metadata. |
| `.env` | **Environment Variables** | Stores sensitive configuration variables (e.g., database URLs, API keys, port numbers) that change between environments (development, production). |
| `.gitignore` | **Version Control** | Specifies files and folders that Git should ignore (most notably `node_modules/` and `.env`). |

### API Logic Folders

These folders enforce the separation of concerns, making the application easier to test and maintain.

#### 1. `src/routes/`

| Purpose | Defines the API endpoints and maps them to the correct controller functions. |
| :--- | :--- |
| **Contents** | Files like `userRoutes.js`, `productRoutes.js`. |
| **Role** | **Traffic Director.** It only handles the request path (`/api/users`), HTTP method (`GET`, `POST`), and calls the appropriate controller method. It should contain minimal logic. |

#### 2. `src/controllers/`

| Purpose | Handles the business logic related to the request, interacting with models and services. |
| :--- | :--- |
| **Contents** | Files like `userController.js`, `productController.js`. |
| **Role** | **The Handler.** Takes the request (`req`), extracts data, calls necessary database/service functions, and sends the response (`res`). It ensures input validation and error handling specific to the endpoint. |

#### 3. `src/models/`

| Purpose | Defines the structure of data and manages communication with the database (often used for Mongoose schemas or Sequelize models). |
| :--- | :--- |
| **Contents** | Files like `User.js`, `Product.js`. |
| **Role** | **Data Structure.** Provides the interface for creating, reading, updating, and deleting data records. |

#### 4. `src/middleware/`

| Purpose | Houses functions that execute during the request-response cycle, typically for tasks that apply to multiple routes. |
| :--- | :--- |
| **Contents** | Files like `authMiddleware.js` (for JWT verification), `loggingMiddleware.js`, `errorHandler.js`. |
| **Role** | **Interceptors.** Performs tasks such as authentication, authorization, logging, input sanitization, and global error handling before the request reaches the controller. |

### Supporting Folders (Scalability)

These folders improve organization, modularity, and testability.

#### 5. `src/services/`

| Purpose | Contains reusable, complex business logic that doesn't fit within the controller (which should be thin) or the model (which handles pure data structure). |
| :--- | :--- |
| **Contents** | Files like `emailService.js`, `paymentService.js`, or complex user manipulation logic. |
| **Role** | **Business Logic Abstraction.** Allows controllers to stay clean by offloading heavy computational or external API interaction logic here. This is crucial for scalability and testing. |

#### 6. `src/config/`

| Purpose | Centralizes configuration settings for databases, external APIs, and application constants. |
| :--- | :--- |
| **Contents** | Files like `database.js` (connection logic), `constants.js`, or configuration for environment variables loading. |
| **Role** | **Configuration Hub.** Makes it easy to manage and change application settings in one place. |

#### 7. `src/utils/`

| Purpose | Stores small, reusable helper functions that are not tied to the core business logic (e.g., date formatting, complex calculation functions, custom validators). |
| :--- | :--- |
| **Contents** | Files like `formatter.js`, `validator.js`, `helpers.js`. |
| **Role** | **Toolbox.** Provides general-purpose utilities used across the application. |
    ```

* **Implementation & Changes:**
    "I will implement this folder structure exactly as suggested by Gemini. It provides a strong separation of concerns by splitting logic into routes, controllers, and models, which will make the application easier to build and maintain."



## Prompt 2: Initial Server Boilerplate

* **Prompt:**
    "Hey Gemini. I'm setting up a new Express.js server for an API project. I've already created the file `src/app.js` and I'm ready to write the initial code. Could you help me with the boilerplate?..." .

* **Context:**
    After creating the folder structure, I needed the initial boilerplate code for the main server entry point, `src/app.js`. This prompt was designed to generate a simple, runnable server with comments.

* **Response from Gemini:**
    This provides the complete Node.js/Express boilerplate code for `src/app.js`, including environment variable handling and clear comments explaining the purpose of each section.

## 1. Project Setup (Prerequisites)

Before running the code, ensure you have initialized your project and installed the necessary packages:

```bash
# Initialize a new Node.js project
npm init -y

# Install Express and dotenv
npm install express dotenv
```

## 2. Environment File (`.env`)

Create a file named `.env` in the root of your project directory:

```
# .env file

PORT=8080
# You can set any port here. The app will default to 5000 if this line is missing or commented out.
```

## 3. Server Code (`src/app.js`)

Create a directory named `src` and place the following code inside `src/app.js`:

```javascript
// src/app.js

// =========================================================================
// 1. Module Imports and Configuration
// =========================================================================

// Import the Express framework
const express = require('express');

// Import dotenv to load environment variables from the .env file
require('dotenv').config();

// =========================================================================
// 2. Initialization and Configuration
// =========================================================================

// Initialize the Express application
const app = express();

// Set the port for the server.
// It tries to read the PORT environment variable (e.g., from .env)
// and defaults to 5000 if the environment variable is not set.
const PORT = process.env.PORT || 5000;

// Middleware (Basic setup - optional for this boilerplate)
// This line allows Express to parse JSON bodies from incoming requests
app.use(express.json());


// =========================================================================
// 3. Routes Definition
// =========================================================================

/**
 * Basic Home Route '/'
 * Sends a simple JSON response to confirm the API is operational.
 */
app.get('/', (req, res) => {
    // Send a JSON response
    res.status(200).json({
        message: "API is running successfully",
        environment: process.env.NODE_ENV || 'development'
    });
});

// Example of a 404 handler (best practice for boilerplate)
app.use((req, res) => {
    res.status(404).json({
        message: 'Resource not found'
    });
});

// =========================================================================
// 4. Server Start
// =========================================================================

/**
 * Starts the Express server and listens for incoming connections on the defined port.
 */
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    console.log(`Access the API at: http://localhost:${PORT}`);
});

// Export the app (useful for testing frameworks)
module.exports = app;
```

## 4. How to Run

1.  Update your `package.json` to include a start script:

    ```json
    "scripts": {
      "start": "node src/app.js"
    },
    ```

2.  Run the application:

    ```bash
    npm start
    ```

**Output:**

```
Server listening on port 8080  # Or 5000 if PORT is not set in .env
Access the API at: http://localhost:8080
```

* **Implementation & Changes:**
    I copied the JavaScript code directly into `src/app.js`. The response also included setup instructions (like `npm init` and creating `.env`) which I had already completed in the previous step, so I ignored those parts. This shows the AI providing helpful but sometimes redundant context. I will use the `dev` script with `nodemon` instead of the suggested `start` script for development.




---

## Prompt 3: Database Connection Logic

* **Prompt:**
    "Hey Gemini, I need to connect my Express app to a MongoDB Atlas database using Mongoose. Can you write the connection logic for me? The code should be in a new file at `src/config/database.js`. The function should read the MongoDB connection string from a `MONGO_URI` environment variable, handle the connection asynchronously, and log success or error messages to the console."

* **Context:**
    To prepare for creating the application's CRUD logic, I first needed a robust, reusable function to connect to the MongoDB Atlas database. Placing this in the `config` directory keeps the main `app.js` file clean and organized.

* **Response from Gemini:**
    This is a critical step for modern Express applications. Separating the database connection logic into a dedicated configuration file (src/config/database.js) keeps app.js clean and promotes modularity.

Here is the implementation for src/config/database.js.

1. Prerequisites and Environment Setup
Make sure you have installed the Mongoose package:

npm install mongoose
Ensure your .env file contains the MONGO_URI:

# .env file

PORT=8080
MONGO_URI="mongodb+srv://<username>:<password>@<clustername>.mongodb.net/<dbname>?retryWrites=true&w=majority"
2. Database Connection Logic (src/config/database.js)
Create the file src/config/database.js and add the following asynchronous connection function:

// src/config/database.js

// Import Mongoose
const mongoose = require('mongoose');

/**
 * Asynchronously connects the application to the MongoDB Atlas database using Mongoose.
 */
const connectDB = async () => {
    // 1. Check for MONGO_URI
    if (!process.env.MONGO_URI) {
        console.error('FATAL ERROR: MONGO_URI is not defined in environment variables.');
        // Exit the process if the URI is missing, as the application cannot run without it
        process.exit(1); 
    }

    try {
        // 2. Attempt Connection
        // Use mongoose.connect with the URI from environment variables
        // The options are often recommended to avoid deprecated warnings
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // These options are standard best practices for modern Mongoose connections
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // 3. Log Success
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);

    } catch (error) {
        // 4. Handle Errors
        console.error(`MongoDB Connection Error: ${error.message}`.red.bold);
        
        // Exit the process with failure code (1)
        process.exit(1); 
    }
};

// Export the connection function
module.exports = connectDB;

// Note: I've used 'colors' package styling (cyan, red, bold) for better console output.
// If you want colored output, you should install it: `npm install colors`
Note on Colors Package
The logging above uses the colors package for better readability in the console. If you wish to use colored output, you need to install it and require it once (usually in your app.js or database.js):

npm install colors
If you don't want to install colors, just remove the .cyan.underline.bold and .red.bold parts from the console.log statements.

* **Implementation & Changes:**
    I created the `src/config/database.js` file and pasted the generated code into it[. I also called this `connectDB` function from my main `app.js` file to ensure the database connects when the server starts. The AI suggested using the `colors` package for better console logs. I decided to install it (`npm install colors`) and require it at the top of my `database.js` file to make the logs more readable during development.

---



## Prompt 4: Expense Mongoose Model

* **Prompt:**
    "Gemini, please create a Mongoose schema and model for an 'Expense'. This code should go in a new file at `src/models/Expense.js`. The schema must include the following fields as required by my project: - `description`: A Text field... - `category`: An Enum field... - `isReimbursable`: A Boolean field... - `baseAmount`: A required Number... - `taxAmount`: A required Number... Please also include Mongoose's built-in timestamps."

* **Context:**
    This prompt directly addresses the project requirement for a data model with specific field types (Text, Enum, Boolean)[cite: 2]. The goal was to create the Mongoose schema that will serve as the foundation for all CRUD operations related to expenses.

* **Response from Gemini:**
    This code defines the Mongoose schema and model for your `Expense` object, ensuring all specified constraints, required fields, and the use of timestamps are implemented.

## 1. Expense Model (`src/models/Expense.js`)

Create the file `src/models/Expense.js` and add the following content:

```javascript
// src/models/Expense.js

const mongoose = require('mongoose');

// Define the valid categories for the expense
const CATEGORY_ENUM = ['Food', 'Travel', 'Office Supplies', 'Other'];

// -------------------------------------------------------------------------
// Expense Schema Definition
// -------------------------------------------------------------------------

const ExpenseSchema = new mongoose.Schema({
    // 1. description: Required String
    description: {
        type: String,
        required: [true, 'Description is required.'],
        trim: true, // Removes whitespace from both ends of a string
        maxlength: [200, 'Description cannot be more than 200 characters.']
    },

    // 2. category: Required Enum String with Default
    category: {
        type: String,
        required: [true, 'Category is required.'],
        enum: {
            values: CATEGORY_ENUM,
            message: 'Category must be one of: Food, Travel, Office Supplies, or Other.'
        },
        default: 'Other'
    },

    // 3. isReimbursable: Boolean with Default
    isReimbursable: {
        type: Boolean,
        default: false
    },

    // 4. baseAmount: Required Number (must be non-negative)
    baseAmount: {
        type: Number,
        required: [true, 'Base amount is required.'],
        min: [0, 'Base amount cannot be negative.']
    },

    // 5. taxAmount: Required Number (must be non-negative)
    taxAmount: {
        type: Number,
        required: [true, 'Tax amount is required.'],
        min: [0, 'Tax amount cannot be negative.']
    },
},
// 6. Timestamps
{
    // Adds 'createdAt' and 'updatedAt' fields automatically
    timestamps: true 
});


// -------------------------------------------------------------------------
// Virtual Property (Optional but highly recommended)
// -------------------------------------------------------------------------

/**
 * Defines a virtual property 'totalAmount' which is the sum of baseAmount and taxAmount.
 * This is not stored in the database but calculated on retrieval.
 */
ExpenseSchema.virtual('totalAmount').get(function() {
    return this.baseAmount + this.taxAmount;
});


// -------------------------------------------------------------------------
// Model Creation and Export
// -------------------------------------------------------------------------

const Expense = mongoose.model('Expense', ExpenseSchema);

module.exports = Expense;
```

* **Implementation & Changes:**
    The code was implemented exactly as provided in a new `src/models/Expense.js` file[cite: 2]. The AI did an excellent job, not only by including all the required fields but also by adding helpful validations like `trim` and `min: 0`. Most importantly, it suggested and included a Mongoose **virtual property** called `totalAmount`[cite: 2]. This is a perfect and efficient way to implement the "calculated field" requirement from the PDF, as it calculates the value on the fly without storing redundant data in the database. I will be using this virtual property when I build the API endpoints.




 ---

## Prompt 5: CRUD Controller Logic

* **Prompt:**
"Hey Gemini, I'm building the CRUD functionality for my Expense model. Please write the code for a new file at src/controllers/expenseController.js. It should export four asynchronous functions:
createExpense: Takes description, category, baseAmount, and taxAmount from the request body, creates a new Expense document, and returns it with a 201 status.
getExpenses: Fetches all expenses from the database and returns them.
updateExpense: Finds an expense by its ID from the URL parameters, updates it with data from the request body, and returns the updated document.
deleteExpense: Finds an expense by ID and deletes it, then returns a success message. Please import the Expense model from ../models/Expense.js and include basic try-catch error handling for each function.

."

* **Context:**
    This prompt was for generating the core business logic of the application. The controller functions are responsible for interacting with the database model to perform the Create, Read, Update, and Delete operations required by the assignment.

* **Response from Gemini:**
    This provides the full controller logic for handling CRUD operations on the Expense model, complete with validation, error handling, and appropriate HTTP status codes.

1. Expense Controller (src/controllers/expenseController.js)
Create the file src/controllers/expenseController.js and add the following code:

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
            taxAmount
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
        // Fetch all expenses
        const expenses = await Expense.find();

        // Respond with the list of expenses and 200 status
        res.status(200).json({
            success: true,
            count: expenses.length,
            data: expenses
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Server Error' 
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
        let expense = await Expense.findById(req.params.id);

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
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({
                success: false,
                error: 'Expense not found'
            });
        }

        // Delete the document
        await expense.deleteOne(); 

        // Respond with 200 and a message (or 204 No Content for standard practice)
        res.status(200).json({
            success: true,
            message: 'Expense deleted successfully',
            data: {} // Return empty object for deleted resource
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

* **Implementation & Changes:**
    I implemented the code exactly as provided in `src/controllers/expenseController.js`. The AI-generated code was high-quality, including `try-catch` blocks for error handling and specific checks for non-existent documents, which is a robust way to build an API.

---

## Prompt 6: API Routes

* **Prompt:**
Thanks, that's perfect. Now I need the corresponding Express routes file at src/routes/expenseRoutes.js. Please create an Express router that defines the following endpoints:
POST / should map to the createExpense function.
GET / should map to the getExpenses function.
PUT /:id should map to the updateExpense function.
DELETE /:id should map to the deleteExpense function. It must import the functions from ../controllers/expenseController.js and export the router."

* **Context:**
    After creating the controller logic, I needed to define the API endpoints (URLs) and connect them to the appropriate controller functions. This prompt was to generate the Express router for that purpose.

* **Response from Gemini:**
    Here is the implementation for `src/routes/expenseRoutes.js`, setting up the RESTful endpoints and linking them directly to the controller functions you created.

## 1. Expense Routes (`src/routes/expenseRoutes.js`)

Create the file `src/routes/expenseRoutes.js` and add the following content:


// src/routes/expenseRoutes.js

const express = require('express');

// Import the controller functions
const {
    createExpense,
    getExpenses,
    updateExpense,
    deleteExpense
} = require('../controllers/expenseController');

// Initialize the Express Router
const router = express.Router();

// -------------------------------------------------------------------------
// Route Definitions
// -------------------------------------------------------------------------

/**
 * Routes that operate on the collection of expenses (GET all, POST new)
 * 
 * Base URL: /api/v1/expenses
 */
router.route('/')
    .post(createExpense)  // POST /api/v1/expenses -> createExpense
    .get(getExpenses);    // GET /api/v1/expenses -> getExpenses

/**
 * Routes that operate on a single expense resource (GET by ID, PUT, DELETE)
 * 
 * Base URL: /api/v1/expenses/:id
 */
router.route('/:id')
    // We didn't create a specific getExpenseById function, but the pattern is common:
    // .get(getExpenseById) 
    .put(updateExpense)    // PUT /api/v1/expenses/:id -> updateExpense
    .delete(deleteExpense); // DELETE /api/v1/expenses/:id -> deleteExpense


// Export the router to be used in app.js
module.exports = router;


* **Implementation & Changes:**
    The generated router code was perfect. It cleanly separated the routes for the collection (`/`) from the routes for a specific item (`/:id`) using `router.route()`. I implemented this code in `src/routes/expenseRoutes.js` and then mounted the router in my main `app.js` file under the path `/api/v1/expenses` for good practice.   



---

## Prompt 7: Secure User Model with Password Hashing

* **Prompt:**
    Hey Gemini, I need to add authentication. Please create a Mongoose schema and model for a User in a new file at src/models/User.js. The schema should have a required, unique username (String) and a required password (String).

    2. "Thanks. Now, modify that `User` schema to make it secure using the `bcryptjs` library. It must automatically hash the password before a user document is saved (use a Mongoose pre-save hook). Add a schema method called `matchPassword` that takes a plain-text password and returns `true` if it matches the hashed password in the database."

* **Context:**
    This was the first step in building the authentication system. The goal was to create the data model for users, with a critical focus on security by ensuring passwords are never stored in plain text.

* **Response from Gemini:**
    This code defines the Mongoose schema and model for your User, ensuring the username is unique and both fields are required, following best practices for basic authentication models.

1. User Model (src/models/User.js)
Create the file src/models/User.js and add the following content:

// src/models/User.js

const mongoose = require('mongoose');

// -------------------------------------------------------------------------
// User Schema Definition
// -------------------------------------------------------------------------

const UserSchema = new mongoose.Schema({
    // 1. Username field
    username: {
        type: String,
        required: [true, 'Username is required.'],
        unique: true, // Ensures no two users share the same username
        trim: true,
        lowercase: true, // Stores usernames in lowercase for consistent lookups
        maxlength: [50, 'Username cannot exceed 50 characters.']
    },

    // 2. Password field (will store the hashed password)
    password: {
        type: String,
        required: [true, 'Password is required.'],
        // Select: false prevents the password from being returned by default 
        // when querying the user database (improving security)
        select: false 
    },
}, 
{
    // Enable Mongoose built-in timestamps
    timestamps: true 
});


// -------------------------------------------------------------------------
// Model Creation and Export
// -------------------------------------------------------------------------

const User = mongoose.model('User', UserSchema);

module.exports = User;
Note on Security: In a real-world application, the password field would never be stored as plain text. Before saving a user, you must use a library like Bcrypt to hash the password within a Mongoose pre-save hook defined in this file.

2.This implementation integrates bcryptjs into the User model via a pre-save hook for password hashing and adds a schema method for password comparison, fulfilling the security requirements.

1. Installation
First, ensure you have the bcryptjs library installed:

npm install bcryptjs
2. Updated User Model (src/models/User.js)
Modify the file src/models/User.js with the following code:

// src/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Import bcryptjs

// -------------------------------------------------------------------------
// User Schema Definition
// -------------------------------------------------------------------------

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required.'],
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: [50, 'Username cannot exceed 50 characters.']
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        select: false 
    },
}, 
{
    timestamps: true 
});

// -------------------------------------------------------------------------
// 1. Mongoose Pre-Save Hook (Password Hashing)
// -------------------------------------------------------------------------

/**
 * Middleware executed BEFORE saving the user document.
 * Checks if the password field has been modified (i.e., new user or password change).
 * If modified, it hashes the password using bcryptjs.
 */
UserSchema.pre('save', async function(next) {
    // Only run this function if the password was actually modified
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Generate a salt (recommended 10-12 rounds for production)
        const salt = await bcrypt.genSalt(10);
        
        // Hash the password using the generated salt
        this.password = await bcrypt.hash(this.password, salt);
        
        next();
    } catch (err) {
        next(err); // Pass error to Mongoose error handler
    }
});


// -------------------------------------------------------------------------
// 2. Schema Method (Password Comparison)
// -------------------------------------------------------------------------

/**
 * Custom instance method to compare an incoming plaintext password with 
 * the hashed password stored in the database.
 * 
 * @param {string} enteredPassword - The plaintext password provided by the user.
 * @returns {Promise<boolean>} - True if passwords match, false otherwise.
 */
UserSchema.methods.matchPassword = async function(enteredPassword) {
    // Use bcrypt.compare() to check the plaintext password against the hash
    return await bcrypt.compare(enteredPassword, this.password);
};


// -------------------------------------------------------------------------
// Model Creation and Export
// -------------------------------------------------------------------------

const User = mongoose.model('User', UserSchema);

module.exports = User;
 

* **Implementation & Changes:**
    I implemented the final version of the code in `src/models/User.js` and installed the `bcryptjs` package. This two-prompt approach was effective, as it allowed me to first confirm the basic structure before layering on the more complex security logic like the pre-save hook and password comparison method.

---

## Prompt 8: Authentication Controllers and Routes

* **Prompt:**
1. Gemini, I need the controller for user authentication in a new file at src/controllers/authController.js. It should have two functions:
registerUser: Takes username and password from the request body, checks if the user already exists, and if not, creates a new user. The password hashing will be handled automatically by the model.
loginUser: Takes username and password, finds the user by username, and then uses the matchPassword method to verify the password. Both functions should return the user's data (without the password) on success.
    2. "Now create the Express router for authentication in a new file at `src/routes/authRoutes.js`. It should define two routes: `POST /register` mapped to `registerUser` and `POST /login` mapped to `loginUser`."

* **Context:**
    With the User model created, I needed the business logic (controller) and API endpoints (routes) to allow users to register and log in.

* **Response from Gemini:**
1.This implementation provides the core logic for user registration and login, utilizing the secure features (hashing and comparison method) you added to the User model.

=>Authentication Controller (src/controllers/authController.js)
Create the file src/controllers/authController.js and add the following code:

// src/controllers/authController.js

const User = require('../models/User');

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
exports.registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Basic validation
        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide both username and password' 
            });
        }
        
        // Ensure username is converted to lowercase for consistent checking
        const lowerUsername = username.toLowerCase();

        // 2. Check if user already exists
        const userExists = await User.findOne({ username: lowerUsername });

        if (userExists) {
            return res.status(400).json({ 
                success: false, 
                message: 'User already exists' 
            });
        }

        // 3. Create the new user (hashing handled by pre-save hook in the model)
        const user = await User.create({
            username: lowerUsername,
            password,
        });

        // 4. Return success response (select: false ensures password is not included)
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                _id: user._id,
                username: user.username,
                createdAt: user.createdAt,
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Server Error during registration' 
        });
    }
};

/**
 * @desc    Log in a user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Basic validation
        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please enter username and password' 
            });
        }
        
        const lowerUsername = username.toLowerCase();

        // 2. Find user by username
        // We use .select('+password') to explicitly retrieve the password hash 
        // because we set select: false in the schema.
        const user = await User.findOne({ username: lowerUsername }).select('+password');

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // 3. Check password using the model's matchPassword method
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // 4. Successful login: Return user data (without password)
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                _id: user._id,
                username: user.username,
                createdAt: user.createdAt,
            }
            // NOTE: In a real app, a JWT token would be generated and sent here
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: 'Server Error during login' 
        });
    }
};
2.Here is the implementation for src/routes/authRoutes.js, defining the necessary endpoints for user authentication and linking them to the controller functions.

Authentication Routes (src/routes/authRoutes.js)
Create the file src/routes/authRoutes.js and add the following content:

// src/routes/authRoutes.js

const express = require('express');
const router = express.Router();

// Import the controller functions
const {
    registerUser,
    loginUser
} = require('../controllers/authController');

// -------------------------------------------------------------------------
// Route Definitions for Authentication
// -------------------------------------------------------------------------

/**
 * Route: POST /register
 * Maps to the registerUser controller function.
 */
router.post('/register', registerUser);

/**
 * Route: POST /login
 * Maps to the loginUser controller function.
 */
router.post('/login', loginUser);


// Export the router to be used in app.js
module.exports = router;


* **Implementation & Changes:**
    I created the two new files as specified and pasted in the generated code. I then imported the `authRoutes.js` file into my main `app.js` and mounted it at the `/api/v1/auth` endpoint.

---

## Prompt 9: JWT Generation and Route Protection

* **Prompt:**
    1. "Hey Gemini, please update the `loginUser` function in `src/controllers/authController.js`... I need it to generate and return a JSON Web Token (JWT) upon successful login..."
    2. "Gemini, now I need a middleware function to protect my routes. Please write the code for a new file at `src/middleware/authMiddleware.js`. The function should be named `protect`..."

* **Context:**
    This was the final and most critical part of securing the application. I needed to issue a token upon login and then create a "gatekeeper" middleware that could validate that token to protect my expense routes from unauthorized access.

* **Response from Gemini:**
    1.This update to loginUser integrates JWT generation, ensuring authentication is complete and providing a mechanism for authorizing future requests.

1. Installation and Environment Setup
First, ensure you have the jsonwebtoken library installed and that you have a secret key defined in your environment variables.

npm install jsonwebtoken
In your .env file (at the root of your project):

# .env file

PORT=8080
MONGO_URI="mongodb+srv://..."
JWT_SECRET="YOUR_SUPER_SECRET_KEY_HERE"  # Use a long, complex string
2. Updated Authentication Controller (src/controllers/authController.js)
Here is the modified loginUser function along with a helper function to generate the token:

// src/controllers/authController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken

// -------------------------------------------------------------------------
// Helper Function: Generate JWT
// -------------------------------------------------------------------------

/**
 * Generates a JSON Web Token (JWT) for the given user ID.
 * @param {string} id - The MongoDB ObjectID of the user.
 * @returns {string} The signed JWT.
 */
const generateToken = (id) => {
    // Check if secret is available
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables.');
    }

    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token expires in 30 days
    });
};


/**
 * @desc    Log in a user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please enter username and password' 
            });
        }
        
        const lowerUsername = username.toLowerCase();

        // 1. Find user and explicitly select password hash
        const user = await User.findOne({ username: lowerUsername }).select('+password');

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // 2. Check password using the model's matchPassword method
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // 3. Password verified - Generate JWT token
        const token = generateToken(user._id);

        // 4. Successful login: Return user data and the token
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                _id: user._id,
                username: user.username,
                token: token, // <-- JWT returned here
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Server Error during login' 
        });
    }
};

// Ensure registerUser is still exported (unchanged)
exports.registerUser = async (req, res) => {
    // ... (rest of the registerUser function)
};
Note: I've included a standalone generateToken helper function. You could also integrate this logic directly into the User schema as a method if you prefer, but keeping the JWT logic in the controller or a separate service is often clearer.

2.This authMiddleware.js file provides the necessary logic to verify JWTs, authenticate users, and protect your API endpoints.

1. Middleware File (src/middleware/authMiddleware.js)
Create the file src/middleware/authMiddleware.js and add the following code:

// src/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Need the User model to find the user

/**
 * Middleware function to protect routes by verifying JWT authentication.
 * Checks for a token in the Authorization header.
 */
exports.protect = async (req, res, next) => {
    let token;

    // 1. Check if token exists in the header (Authorization: Bearer TOKEN)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (split "Bearer TOKEN" into array and take the second element)
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify token
            if (!process.env.JWT_SECRET) {
                // This is a safety check; ideally, this error is caught on server startup
                throw new Error('JWT_SECRET is not configured.');
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Find user by ID from the decoded payload
            // We exclude the password explicitly here, although the model defaults to select: false
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Not authorized, user not found' 
                });
            }

            // 4. Attach user to the request object (req.user)
            req.user = user;

            // 5. Continue to the next middleware or controller
            next();

        } catch (error) {
            console.error(error);
            // Handle expired token or invalid signature errors
            return res.status(401).json({ 
                success: false, 
                message: 'Not authorized, token failed or expired' 
            });
        }
    }

    // If no token is provided in the header
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Not authorized, no token provided' 
        });
    }
};




* **Implementation & Changes:**
    I updated my `loginUser` function, installed the `jsonwebtoken` package, and added the `JWT_SECRET` to my `.env` file. I then created the `authMiddleware.js` file. The final step was to import the `protect` middleware into `expenseRoutes.js` and add it to each of the CRUD routes, successfully securing them.


## Prompt 10: Refactor for Pagination and Filtering

* **Prompt:**
    "Hey Gemini, I need to refactor my getExpenses function in src/controllers/expenseController.js to add filtering and pagination.
Here is my current function:
exports.getExpenses = async (req, res) => {
try {
// Fetch all expenses
const expenses = await Expense.find();

// Respond with the list of expenses and 200 status
res.status(200).json({
success: true,
count: expenses.length,
data: expenses
});

} catch (error) {
res.status(500).json({
success: false,
error: 'Server Error'
});
}
};
Please modify it to include the following logic:Filtering: It should check for a category query parameter in the request URL (req.query.category). If a category is provided, it should only return expenses that match that category.Pagination: It should accept page and limit query parameters. The page should default to 1 and the limit to 5. It should use these to skip the correct number of documents and limit the results.Response: The final JSON response should be an object that includes pagination details (like currentPage, totalPages, count) along with the data array of expenses.""

* **Context:**
    This prompt was to implement two core requirements from the assignment PDF: pagination and filtering. Instead of starting from scratch, I provided the AI with the existing code and asked it to refactor it, which is a more advanced and realistic development workflow.

* **Response from Gemini:**
    This refactoring significantly enhances the getExpenses function by implementing robust filtering and pagination, making the API more flexible and scalable.

1. Updated Expense Controller (src/controllers/expenseController.js)
Here is the modified getExpenses function within src/controllers/expenseController.js:

// src/controllers/expenseController.js

const Expense = require('../models/Expense');
// ... other controller functions ...

/**
 * @desc    Get all expenses with filtering and pagination
 * @route   GET /api/v1/expenses?category=Food&page=1&limit=5
 * @access  Public (for now)
 */
exports.getExpenses = async (req, res) => {
    try {
        // -----------------------------
        // 1. Filtering Logic
        // -----------------------------
        
        let query = {}; // Base query object

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

// ... other controller functions ...


* **Implementation & Changes:**
    I replaced my old controller function with this new one. The AI's solution was very comprehensive. It correctly handled default values for page and limit, built a dynamic query object for filtering, and used `countDocuments` to provide accurate pagination metadata like `totalPages`. This is a much more powerful and user-friendly API endpoint now.



## Prompt 11: React Login Page Component

* **Prompt:**
Hey Gemini, I'm using React and react-router-dom, and I have an API service file at src/services/api.js. Please write the code for a new React component for my login page, to be saved at src/pages/LoginPage.jsx. The component must:
Be a functional component using React hooks.Use the useState hook to manage username, password, error, and loading states.Render a form that calls a handleLogin function on submit. The form should have inputs for username and password, and a submit button.The handleLogin function must call the loginUser function from ../services/api.js.After a successful login, it should console.log the user data and token. For now, it should not redirect.If there is a login error, it should store the error message in the error state and display it on the screen.Disable the submit button when the form is submitting (i.e., when loading is true)."

* **Context:**
    This was the first major UI component for the application. The goal was to create a functional login form that could handle user input, communicate with the backend API service I created earlier, and provide clear feedback to the user (loading states and error messages).

* **Response from Gemini:**
    This React component provides a functional login form that handles state, communicates with the backend API, manages loading state, and displays errors effectively.

1. Login Page Component (src/pages/LoginPage.jsx)
Create the file src/pages/LoginPage.jsx and add the following content:

// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { loginUser } from '../services/api'; // Import the loginUser function

const LoginPage = () => {
  // State management for form inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // State management for UI feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    
    // Reset previous error and set loading state
    setError(null);
    setLoading(true);

    try {
      // 1. Call the API service
      const response = await loginUser({ username, password });

      // 2. Successful Login
      // The response structure is expected to be { success: true, message: 'Login successful', data: { _id, username, token } }
      const { data } = response;
      
      // Log the data for verification (per requirement)
      console.log('Login Successful!', data);
      console.log('User ID:', data._id);
      console.log('JWT Token:', data.token);

      // --- TODO: In a real app, you would store the token (e.g., in localStorage or Context) 
      // --- and redirect the user here.

    } catch (err) {
      // 3. Handle Errors
      console.error('Login Error:', err);
      // Assuming the API error structure has a 'message' field
      const errorMessage = err.message || 'An unknown error occurred during login.';
      setError(errorMessage);

    } finally {
      // 4. Reset loading state
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>User Login</h2>
      
      {/* Display error message if present */}
      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleLogin} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          style={styles.button}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

// Simple inline styles for readability (replace with proper CSS/styling library)
const styles = {
    container: {
        maxWidth: '400px',
        margin: '50px auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        textAlign: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    formGroup: {
        textAlign: 'left',
    },
    error: {
        color: 'red',
        marginBottom: '15px',
        border: '1px solid red',
        padding: '10px',
        borderRadius: '4px',
    },
    button: {
        padding: '10px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    }
};

export default LoginPage;

* **Implementation & Changes:**
    The generated code was excellent and implemented in `src/pages/LoginPage.jsx`. It correctly used `useState` for state management and `async/await` for the API call. After implementing it, I also did a refactoring step (prompted separately) to move the inline styles into a dedicated `LoginPage.css` file, which improved the code's organization. The logic was later updated to use the `useAuth` hook instead of `useContext` directly.


 ## Prompt 12: React Dashboard Page Component

* **Prompt:**
"Gemini, please write the code for my main dashboard page at src/pages/DashboardPage.jsx. This component must:
Use the useAuth custom hook from my AuthContext to get the current user's information and token.Use useState to manage expenses, loading, and error states.Use the useEffect hook to call the fetchExpenses function from my api.js service as soon as the component loads. It must pass the token to this function.Render a welcome message, like 'Welcome, [username]!'.Display a list of the expenses. For each expense, show its description, category, and totalAmount.While the data is being fetched, it should display a "Loading expenses..." message.If there's an error fetching the data, it should display an error message.Include a 'Logout' button that, when clicked, calls the logout function from the useAuth hook."



* **Context:**
    This prompt was for the main page of the application that users see after logging in. The goal was to create a component that securely fetches and displays protected data (the user's expenses) by using the JWT token managed by the `AuthContext`. It also needed to include a logout function.

* **Response from Gemini:**
    This DashboardPage component demonstrates how to securely fetch protected data using the stored JWT, handle various loading and error states, and manage the user session via the AuthContext.

1. Dashboard Component (src/pages/DashboardPage.jsx)
Create the file src/pages/DashboardPage.jsx and add the following content:

// src/pages/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchExpenses } from '../services/api';

const DashboardPage = () => {
  // Use the custom hook to access authentication state and functions
  const { user, token, logout } = useAuth();

  // State for expenses data and UI feedback
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---------------------------------------------------------------------
  // Data Fetching Hook
  // ---------------------------------------------------------------------
  useEffect(() => {
    // Ensure we have a token before trying to fetch protected data
    if (!token) {
        setLoading(false);
        setError("Authentication token not found. Please log in.");
        return;
    }
    
    const loadExpenses = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch expenses using the token for authorization
        // We can pass optional query parameters here if needed, e.g., { page: 1, limit: 10 }
        const response = await fetchExpenses(token); 
        
        // The API returns the expenses in the 'data' field of the response
        setExpenses(response.data); 
      } catch (err) {
        console.error('Error fetching expenses:', err);
        // Assuming the error structure has a 'message' field
        const errorMessage = err.message || 'Failed to load expense data.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
  }, [token]); // Dependency array: Re-run effect if the token changes

  // ---------------------------------------------------------------------
  // Render Logic
  // ---------------------------------------------------------------------

  // Display loading state
  if (loading) {
    return <div style={styles.container}><h2>Loading expenses...</h2></div>;
  }

  // Display error state
  if (error) {
    return (
      <div style={styles.container}>
        <h2 style={styles.error}>Error: {error}</h2>
      </div>
    );
  }
  
  // Safety check: Should not happen if AuthProvider handles initial load correctly
  if (!user) {
    return <div style={styles.container}><h2>Please log in to view the dashboard.</h2></div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Welcome, {user.username}!</h1>
        <button onClick={logout} style={styles.logoutButton}>
          Logout
        </button>
      </div>

      <hr style={styles.divider} />
      
      <h3>Your Expenses ({expenses.length})</h3>

      {expenses.length === 0 ? (
        <p>You have no expenses recorded yet.</p>
      ) : (
        <ul style={styles.expenseList}>
          {expenses.map((expense) => (
            <li key={expense._id} style={styles.expenseItem}>
              <div style={styles.itemDetail}>
                <strong>{expense.description}</strong>
                <span style={styles.categoryBadge}>{expense.category}</span>
              </div>
              <div style={styles.amount}>
                ${(expense.baseAmount + expense.taxAmount).toFixed(2)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Simple inline styles
const styles = {
    container: {
        maxWidth: '800px',
        margin: '50px auto',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logoutButton: {
        padding: '8px 15px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    divider: {
        margin: '20px 0',
        borderColor: '#eee',
    },
    expenseList: {
        listStyle: 'none',
        padding: 0,
    },
    expenseItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        borderBottom: '1px solid #eee',
    },
    itemDetail: {
        display: 'flex',
        flexDirection: 'column',
    },
    categoryBadge: {
        fontSize: '0.8em',
        color: '#666',
        marginTop: '3px',
    },
    amount: {
        fontWeight: 'bold',
        fontSize: '1.1em',
    },
    error: {
        color: 'red',
    }
};

export default DashboardPage;

* **Implementation & Changes:**
    The generated code was implemented in `src/pages/DashboardPage.jsx`. It correctly used the `useAuth` hook and `useEffect` to manage the data fetching lifecycle. The AI's code also handled loading and error states gracefully, which is a key part of a good user experience. I also followed its lead to refactor the inline styles into a separate CSS file for better code quality.   