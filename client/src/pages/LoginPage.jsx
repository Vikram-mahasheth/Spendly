// client/src/pages/LoginPage.jsx

import React, { useState } from 'react'; // <-- We do NOT import useContext
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext.jsx'; // <-- CORRECT: We import the custom hook
import './LoginPage.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth(); // <-- CORRECT: We call the custom hook to get the login function
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await loginUser({ username, password });
    
    // The entire response.data object IS the user data, plus the token.
    // We can separate them like this:
    const { token, ...userData } = response.data; 

    // Now, pass the correct data to the login function
    login(userData, token);
    
    // And then navigate
    navigate('/');

        } catch (err) {
            const errorMessage = err.message || 'An unknown error occurred during login.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2>User Login</h2>
            
            {error && <p className="error">{error}</p>}

            <form onSubmit={handleLogin} className="form">
                <div className="form-group">
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

                <div className="form-group">
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
                    className="button"
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default LoginPage;