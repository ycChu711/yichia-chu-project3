// PostList.jsx
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Link } from 'react-router-dom';
import { posts } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import '../styles/common.css';
import '../styles/PostList.css';

const PostList = forwardRef(({ username }, ref) => {
    const [postsList, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingPost, setEditingPost] = useState(null);
    const [editContent, setEditContent] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        loadPosts();
    }, [username]);

    useImperativeHandle(ref, () => ({
        loadPosts
    }));

    async function loadPosts() {
        try {
            setLoading(true);
            const data = username
                ? await posts.getByUser(username)
                : await posts.getAll();
            setPosts(data);
        } catch (err) {
            setError('Error loading posts');
            console.error('Error loading posts:', err);
        } finally {
            setLoading(false);
        }
    }

    async function handleSaveEdit(postId) {
        try {
            await posts.update(postId, editContent);
            setEditingPost(null);
            setEditContent('');
            loadPosts();
        } catch (err) {
            setError('Error updating post');
        }
    }

    async function handleDeletePost(postId) {
        if (!window.confirm('Are you sure you want to delete this post?')) {
            return;
        }

        try {
            await posts.delete(postId);
            loadPosts();
        } catch (err) {
            setError('Error deleting post');
        }
    }

    if (loading) return <div>Loading posts...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (postsList.length === 0) return <div>No posts yet</div>;

    return (
        <div className="post-list">
            {postsList.map(post => (
                <div key={post._id} className="post-card">
                    <div className="post-header">
                        <div>
                            <Link to={`/user/${post.author}`} className="post-author">
                                {post.author}
                            </Link>
                            <span className="post-timestamp">
                                {new Date(post.createdAt).toLocaleString()}
                                {post.updatedAt !== post.createdAt && ' (edited)'}
                            </span>
                        </div>
                        {user === post.author && (
                            <div className="post-actions">
                                {editingPost === post._id ? (
                                    <>
                                        <button onClick={() => handleSaveEdit(post._id)} className="button save">
                                            Save
                                        </button>
                                        <button onClick={() => setEditingPost(null)} className="button cancel">
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => {
                                                setEditingPost(post._id);
                                                setEditContent(post.content);
                                            }}
                                            className="button edit"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeletePost(post._id)}
                                            className="button delete"
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    {editingPost === post._id ? (
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="edit-textarea"
                        />
                    ) : (
                        <p className="post-content">{post.content}</p>
                    )}
                </div>
            ))}
        </div>
    );
});
export default PostList;