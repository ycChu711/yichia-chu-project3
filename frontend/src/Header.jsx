import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/Header.css';

export default function Header() {
    const [activeUsername, setActiveUsername] = useState(null);
    const navigate = useNavigate();

    function checkIfUserIsLoggedIn() {
        try {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            setActiveUsername(currentUser?.username);
        } catch (error) {
            console.error('Error checking login status:', error);
            setActiveUsername(null);
        }
    }

    useEffect(() => {
        checkIfUserIsLoggedIn();
    }, []);

    function logOutUser() {
        try {
            localStorage.removeItem('currentUser');
            setActiveUsername(null);
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    }

    return (
        <div className='header'>
            <Link to="/" className="home-link">Home</Link>
            <div className="auth-section">
                {activeUsername ? (
                    <>
                        <span className="welcome-text">Welcome, {activeUsername}</span>
                        <button onClick={logOutUser} className="logout-button">Log Out</button>
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