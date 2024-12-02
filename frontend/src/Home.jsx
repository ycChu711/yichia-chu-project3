import React from 'react';
import Header from './Header';
import PostCreate from './PostCreate';
import PostList from './PostList';

function Home() {
    return (
        <div>
            <Header />
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
                <PostCreate />
                <PostList />
            </div>
        </div>
    );
}

export default Home;