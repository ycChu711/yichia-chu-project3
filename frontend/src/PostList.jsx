// PostList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './styles/common.css';
import './styles/PostList.css';

export default function PostList({ username }) {
    const [posts, setPosts] = useState([]);
    const [activeUsername, setActiveUsername] = useState(null);
    const [editingPost, setEditingPost] = useState(null);
    const [editContent, setEditContent] = useState('');

    useEffect(() => {
        loadPosts();
        checkLoggedInUser();
    }, [username]);

    function checkLoggedInUser() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        setActiveUsername(currentUser?.username);
    }

    function loadPosts() {
        try {
            const allPosts = JSON.parse(localStorage.getItem('posts') || '[]');
            const filteredPosts = username
                ? allPosts.filter(post => post.author === username)
                : allPosts;

            const sortedPosts = filteredPosts.sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            setPosts(sortedPosts);
        } catch (error) {
            console.error('Error loading posts:', error);
        }
    }

    function startEditing(post) {
        setEditingPost(post._id);
        setEditContent(post.content);
    }

    function cancelEditing() {
        setEditingPost(null);
        setEditContent('');
    }

    function saveEdit() {
        try {
            const allPosts = JSON.parse(localStorage.getItem('posts') || '[]');
            const updatedPosts = allPosts.map(post => {
                if (post._id === editingPost) {
                    return {
                        ...post,
                        content: editContent,
                        edited: true,
                        editedAt: new Date().toISOString()
                    };
                }
                return post;
            });

            localStorage.setItem('posts', JSON.stringify(updatedPosts));
            setEditingPost(null);
            setEditContent('');
            loadPosts();
        } catch (error) {
            console.error('Error saving edit:', error);
        }
    }

    function deletePost(postId) {
        try {
            const allPosts = JSON.parse(localStorage.getItem('posts') || '[]');
            const updatedPosts = allPosts.filter(post => post._id !== postId);
            localStorage.setItem('posts', JSON.stringify(updatedPosts));
            loadPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    }

    return (
        <div className="post-list">
            {posts.map(post => (
                <div key={post._id} className="post-card">
                    <div className="post-header">
                        <div>
                            <Link to={`/user/${post.author}`} className="post-author">
                                {post.author}
                            </Link>
                            <span className="post-timestamp">
                                {new Date(post.createdAt).toLocaleString()}
                                {post.edited && ' (edited)'}
                            </span>
                        </div>
                        {activeUsername === post.author && (
                            <div className="post-actions">
                                {editingPost === post._id ? (
                                    <>
                                        <button onClick={saveEdit} className="button save">
                                            Save
                                        </button>
                                        <button onClick={cancelEditing} className="button cancel">
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => startEditing(post)} className="button edit">
                                            Edit
                                        </button>
                                        <button onClick={() => deletePost(post._id)} className="button delete">
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
}