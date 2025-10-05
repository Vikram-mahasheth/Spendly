// src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import './RegisterPage.css'; // Import the new CSS

const RegisterPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setLoading(true);

        try {
            await registerUser({ username, password });
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 1500); // Wait 1.5 seconds before redirecting
        } catch (err) {
            const errorMessage = err.message || 'Registration failed. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h2>User Registration</h2>
            
            {error && <p className="error">{error}</p>}
            {success && <p className="success">Registration successful! Redirecting to login...</p>}

            <form onSubmit={handleRegister} className="form">
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={loading || success}
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
                        disabled={loading || success}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading || success} 
                    className="button"
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
            
            <div className="link-container">
                <Link to="/login" className="auth-link">Already have an account? Login</Link>
            </div>
        </div>
    );
};

export default RegisterPage;