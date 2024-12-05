import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { users } from '../utils/api';
import Header from '../components/Header';
import PostList from '../components/PostList';
import PostCreate from '../components/PostCreate';
import { useAuth } from '../context/AuthContext';
import '../styles/UserProfile.css';

export default function UserProfile() {
    const { username } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const postListRef = useRef();
    const { user } = useAuth();

    const handlePostCreated = () => {
        if (postListRef.current) {
            postListRef.current.loadPosts();
        }
    };

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
        <div className='user-profile'>
            <Header />
            <div className="container">
                <div className="profile-header">
                    <h1 className="profile-title">{username}'s Profile</h1>
                    <p className="profile-joined">
                        Joined: {userData.joinedAt &&
                            new Date(userData.joinedAt).toLocaleDateString()}
                    </p>
                </div>
                {user === username && (
                    <div className="profile-actions">
                    </div>
                )}
                {user === username && <PostCreate onPostCreated={handlePostCreated} />}
                <h2 className="profile-posts-title">Posts</h2>
                <PostList ref={postListRef} username={username} />
            </div>
        </div>
    );
}