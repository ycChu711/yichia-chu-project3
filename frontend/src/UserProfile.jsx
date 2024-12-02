import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import PostList from './PostList';
import './styles/common.css';
import './styles/UserProfile.css';

export default function UserProfile() {
    const { username } = useParams();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        loadUserData();
    }, [username]);

    function loadUserData() {
        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.username === username);
            setUserData(user);
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    return (
        <div>
            <Header />
            <div className="container">
                <div className="profile-header">
                    <h1 className="profile-title">{username}'s Profile</h1>
                    <p className="profile-joined">
                        Joined: {userData?.joinedAt &&
                            new Date(userData.joinedAt).toLocaleDateString()}
                    </p>
                </div>
                <h2 className="profile-posts-title">Posts</h2>
                <PostList username={username} />
            </div>
        </div>
    );
}