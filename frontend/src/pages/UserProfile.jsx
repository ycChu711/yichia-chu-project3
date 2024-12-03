import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { users } from '../utils/api';
import Header from '../components/Header';
import PostList from '../components/PostList';
import { useAuth } from '../context/AuthContext';

export default function UserProfile() {
    const { username } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth(); // Get current logged in user

    useEffect(() => {
        loadUserData();
    }, [username]);

    async function loadUserData() {
        try {
            setLoading(true);
            const data = await users.getProfile(username);
            setUserData(data);
        } catch (err) {
            setError('Error loading user profile');
            console.error('Error loading user data:', err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return (
        <>
            <Header />
            <div className="container">Loading profile...</div>
        </>
    );

    if (error) return (
        <>
            <Header />
            <div className="container error-message">{error}</div>
        </>
    );

    if (!userData) return (
        <>
            <Header />
            <div className="container">User not found</div>
        </>
    );

    return (
        <div>
            <Header />
            <div className="container">
                <div className="profile-header">
                    <h1 className="profile-title">{username}'s Profile</h1>
                    <p className="profile-joined">
                        Joined: {userData.joinedAt &&
                            new Date(userData.joinedAt).toLocaleDateString()}
                    </p>
                </div>
                {/* Only show edit options if viewing own profile */}
                {user === username && (
                    <div className="profile-actions">
                        {/* Add any profile edit options here */}
                    </div>
                )}
                <h2 className="profile-posts-title">Posts</h2>
                <PostList username={username} />
            </div>
        </div>
    );
}