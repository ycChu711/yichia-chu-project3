import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Header.css';

export default function Header() {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div className='header'>
            <Link to="/" className="home-link">Home</Link>
            <div className="auth-section">
                {user ? (
                    <>
                        <Link to={`/user/${user}`} className="profile-link">
                            Profile
                        </Link>
                        <span className="welcome-text">Welcome, {user}</span>
                        <button onClick={handleLogout} className="logout-button">
                            Log Out
                        </button>
                    </>
                ) : (
                    <div className="auth-links">
                        <Link to="/login">Login</Link>
                        <span className="separator">|</span>
                        <Link to="/register">Register</Link>
                    </div>
                )}
            </div>
        </div>
    );
}