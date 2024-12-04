import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Header.css';

export default function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search/${searchQuery.trim()}`);
            setSearchQuery('');
        }
    };

    return (
        <div className='header'>
            <Link to="/" className="home-link">Home</Link>

            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users..."
                    className="search-input"
                />
                <button type="submit" className="search-button">
                    Search
                </button>
            </form>

            <div className="auth-section">
                {user ? (
                    <>
                        <Link to={`/user/${user}`} className="profile-link">
                            Profile
                        </Link>
                        <span className="welcome-text">Welcome, {user}</span>
                        <button onClick={logout} className="logout-button">
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