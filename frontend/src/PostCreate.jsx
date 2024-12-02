import React, { useState } from 'react';
import './styles/common.css';
import './styles/PostCreate.css';

export default function PostCreate() {
    const [content, setContent] = useState('');
    const [error, setError] = useState('');

    async function handleSubmit() {
        try {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser) {
                setError('Must be logged in to post');
                return;
            }

            const posts = JSON.parse(localStorage.getItem('posts') || '[]');
            const newPost = {
                _id: Date.now().toString(),
                content,
                author: currentUser.username,
                createdAt: new Date().toISOString()
            };

            posts.unshift(newPost);
            localStorage.setItem('posts', JSON.stringify(posts));
            setContent('');
            window.location.reload();
        } catch (error) {
            setError('Error creating post');
        }
    }

    return (
        <div className="post-create">
            <h2 className="post-create-title">Create Post</h2>
            {error && <div className="error-message">{error}</div>}
            <div>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className="post-textarea"
                />
            </div>
            <button onClick={handleSubmit} className="button">
                Post
            </button>
        </div>
    );
}