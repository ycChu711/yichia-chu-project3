import React, { useRef } from 'react';
import Header from '../components/Header';
import PostCreate from '../components/PostCreate';
import PostList from '../components/PostList';
import { useAuth } from '../context/AuthContext';

function Home() {
    const postListRef = useRef();
    const { user } = useAuth();

    // This function will be passed to PostCreate
    const handlePostCreated = () => {
        if (postListRef.current) {
            postListRef.current.loadPosts();
        }
    };

    return (
        <div>
            <Header />
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
                {user && <PostCreate onPostCreated={handlePostCreated} />}
                <PostList ref={postListRef} />
            </div>
        </div>
    );
}

export default Home;