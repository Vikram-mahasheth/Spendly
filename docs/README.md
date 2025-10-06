Expense Tracker - AI Campus Assignment
A full-stack web application that allows users to register, log in, and manage their personal expenses in a secure, multi-user environment. Developed within a 24-hour timeframe with the assistance of an AI programming partner.

🚀 Live Demo
https://spendly-blush.vercel.app/login

✨ Features
🔐 Secure Authentication: Full user registration and login system using JWT for session management.

🔒 Data Privacy: API endpoints are protected to ensure users can only access and manage their own data.

💸 Full CRUD Operations: Users can Create, Read, Update, and Delete their expenses through a clean user interface.

📄 Pagination: The expense list is paginated to handle large datasets efficiently.

🗂️ Filtering: Expenses can be filtered by category.

🔍 Search: Users can perform a case-insensitive search through expense descriptions.

⚡️ Performance Optimization: Search input is debounced to reduce server load and improve user experience.

🛠️ Tech Stack:-
Frontend : React, Vite, React Router, Axios

Backend : Node.js, Express.js

Database : MongoDB (with Mongoose ODM)

Security : JSON Web Tokens (JWT), bcryptjs

Deployment : Vercel (Frontend), Render (Backend)



⚙️ Local Setup and Installation
Follow these instructions to set up and run the project on your local machine.

Prerequisites:
1.Node.js (v16 or later)
2.Git
3.A free MongoDB Atlas account.

1. Clone the Repository
# Clone your repository
git clone https://github.com/Vikram-mahasheth/Spendly

# Navigate into the project directory
cd ai-campus-project

2. Configure and Run the Backend
In a new terminal window:

# 1. Navigate to the server directory
cd server

# 2. Install dependencies
npm install

# 3. Create the environment variables file
touch .env

Open the new /server/.env file and add the following variables with your own credentials:

# Port for the backend server
PORT=8080

# Your MongoDB Atlas connection string
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority

# A long, random string for signing JSON Web Tokens
JWT_SECRET=your_super_secret_and_long_random_string_here

Start the backend server:

# Run the server in development mode
npm run dev

✅ The backend should now be running on http://localhost:8080.

3. Configure and Run the Frontend
Open a second terminal window:

# 1. Navigate to the client directory from the project root
cd client

# 2. Install dependencies
npm install

# 3. Start the frontend development server
npm run dev

✅ The React application should now be running and accessible at http://localhost:5173.
