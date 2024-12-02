import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/common.css';
import './styles/Login.css';

export default function Login() {
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleLogin() {
        setError('');
        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u =>
                u.username === usernameInput &&
                u.password === passwordInput
            );

            if (user) {
                localStorage.setItem('currentUser', JSON.stringify({
                    username: user.username,
                    joinedAt: user.joinedAt
                }));
                navigate('/');
            } else {
                setError('Invalid username or password');
            }
        } catch (e) {
            setError('Error during login');
        }
    }

    return (
        <div className="login-container">
            <h1 className="login-title">Login</h1>
            {error && <div className="error-message">{error}</div>}

            <div className="input-group">
                <label className="input-label">Username:</label>
                <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="input-field"
                />
            </div>

            <div className="input-group">
                <label className="input-label">Password:</label>
                <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="input-field"
                />
            </div>

            <button onClick={handleLogin} className="button">
                Login
            </button>
        </div>
    );
}