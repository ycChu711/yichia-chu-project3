import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/common.css';
import './styles/CreateUser.css';

export default function CreateUser() {
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleSubmit() {
        try {
            // For now, store in localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            if (users.find(u => u.username === usernameInput)) {
                setError('Username already exists');
                return;
            }

            const newUser = {
                username: usernameInput,
                password: passwordInput,
                joinedAt: new Date().toISOString()
            };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            navigate('/login');
        } catch (error) {
            setError('Error creating account');
        }
    }

    return (
        <div className="register-container">
            <h1 className="register-title">Register New User</h1>
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

            <button onClick={handleSubmit} className="button">
                Create Account
            </button>
        </div>
    );
}