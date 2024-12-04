import React, { useState } from 'react';
import { posts } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import '../styles/common.css';
import '../styles/PostCreate.css';


export default function PostCreate({ onPostCreated }) {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };


    async function handleSubmit() {
        if (!content.trim() && !image) {
            setError('Post must have either text or an image');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const formData = new FormData();
            formData.append('content', content.trim() || '');
            if (image) {
                formData.append('image', image);
            }

            console.log('Submitting with content:', content);
            await posts.create(formData);
            setContent('');
            setImage(null);
            setImagePreview(null);

            if (onPostCreated) {
                onPostCreated();
            }
        } catch (error) {
            console.error('Post creation error:', error);
            setError(error.response?.data?.error || 'Error creating post');
        } finally {
            setLoading(false);
        }
    }

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
                <div className="image-upload">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={loading}
                        className="image-input"
                    />
                    {imagePreview && (
                        <div className="image-preview">
                            <img src={imagePreview} alt="Preview" />
                            <button
                                onClick={() => {
                                    setImage(null);
                                    setImagePreview(null);
                                }}
                                className="remove-image"
                            >
                                Remove Image
                            </button>
                        </div>
                    )}
                </div>
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