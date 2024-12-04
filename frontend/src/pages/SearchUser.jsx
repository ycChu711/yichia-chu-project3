import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { users } from '../utils/api';
import Header from '../components/Header';
import '../styles/SearchUser.css';

export default function SearchResults() {
    const { query } = useParams();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const searchUsers = async () => {
            try {
                console.log('Starting search for:', query);
                setLoading(true);
                setError('');
                const data = await users.search(query);
                console.log('Search results:', data);
                setResults(data);
            } catch (err) {
                console.error('Search error:', err);
                setError(err.response?.data?.error || 'Error connecting to server. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            searchUsers();
        }
    }, [query]);

    if (loading) return (
        <>
            <Header />
            <div className="container">Loading...</div>
        </>
    );

    if (error) return (
        <>
            <Header />
            <div className="container error-message">{error}</div>
        </>
    );

    return (
        <>
            <Header />
            <div className="container">
                <h2>Search Results for "{query}"</h2>
                {results.length === 0 ? (
                    <p>No users found</p>
                ) : (
                    <div className="search-results">
                        {results.map(user => (
                            <div key={user.username} className="user-card">
                                <Link to={`/user/${user.username}`}>
                                    <h3>{user.username}</h3>
                                    <p>Joined: {new Date(user.joinedAt).toLocaleDateString()}</p>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}