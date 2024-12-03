import React, { useState } from 'react';
import { posts } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import '../styles/common.css';
import '../styles/PostCreate.css';

// Add onPostCreated prop here
export default function PostCreate({ onPostCreated }) {
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    async function handleSubmit() {
        if (!content.trim()) {
            setError('Post content cannot be empty');
            return;
        }

        try {
            setLoading(true);
            setError('');
            await posts.create(content);
            setContent(''); // Clear the input after successful post
            // Replace window.location.reload() with the callback
            if (onPostCreated) {
                onPostCreated(); // This will trigger parent component to refresh posts
            }
        } catch (error) {
            setError(error.response?.data?.error || 'Error creating post');
        } finally {
            setLoading(false);
        }
    }

    // Rest of the component stays the same
    if (!user) return null;

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
                    disabled={loading}
                />
            </div>
            <button
                onClick={handleSubmit}
                className="button"
                disabled={loading}
            >
                {loading ? 'Posting...' : 'Post'}
            </button>
        </div>
    );
}