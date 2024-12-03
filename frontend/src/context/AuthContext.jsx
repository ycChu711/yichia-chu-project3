import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const data = await auth.checkAuth();
            setUser(data.username);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        try {
            const response = await auth.login(username, password);
            setUser(username);
            return response;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (username, password) => {
        try {
            const response = await auth.register(username, password);
            setUser(username);
            return response;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await auth.logout();
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};