import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import '../styles/CreateUser.css';

export default function CreateUser() {
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();
        if (!usernameInput.trim() || !passwordInput.trim()) {
            setError('Username and password are required');
            return;
        }

        try {
            setLoading(true);
            setError('');
            await register(usernameInput, passwordInput);
        } catch (error) {
            setError(error.response?.data?.error || 'Error creating account');
        } finally {
            setLoading(false);
        }
    }

    return (

        <div className="page-container">
            <Header />

            <div className="register-container">
                <h1 className="register-title">Register New User</h1>
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">Username:</label>
                        <input
                            type="text"
                            value={usernameInput}
                            onChange={(e) => setUsernameInput(e.target.value)}
                            className="input-field"
                            disabled={loading}
                            required
                            minLength={3}
                            maxLength={20}
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Password:</label>
                        <input
                            type="password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            className="input-field"
                            disabled={loading}
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        className="button"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
            </div>
        </div>

    );
}