import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

export default function Login() {
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(usernameInput, passwordInput);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Error during login');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <Header />
            <div className="login-container">
                <h1 className="login-title">Login</h1>
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label className="input-label">Username:</label>
                        <input
                            type="text"
                            value={usernameInput}
                            onChange={(e) => setUsernameInput(e.target.value)}
                            className="input-field"
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Password:</label>
                        <input
                            type="password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            className="input-field"
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}