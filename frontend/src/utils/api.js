import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
    baseURL: 'http://localhost:8000/api',  // your backend URL
    withCredentials: true,  // important for cookies/session
    headers: {
        'Content-Type': 'application/json'
    }
});

// Auth related API calls
export const auth = {
    login: async (username, password) => {
        const response = await api.post('/users/login', { username, password });
        return response.data;
    },

    register: async (username, password) => {
        const response = await api.post('/users/register', { username, password });
        return response.data;
    },

    logout: async () => {
        const response = await api.post('/users/logout');
        return response.data;
    },

    checkAuth: async () => {
        const response = await api.get('/users/auth/status');
        return response.data;
    }
};

// Post related API calls
export const posts = {
    getAll: async () => {
        const response = await api.get('/posts');
        return response.data;
    },

    getByUser: async (username) => {
        const response = await api.get(`/posts/user/${username}`);
        return response.data;
    },

    create: async (content) => {
        const response = await api.post('/posts', { content });
        return response.data;
    },

    update: async (postId, content) => {
        const response = await api.put(`/posts/${postId}`, { content });
        return response.data;
    },

    delete: async (postId) => {
        const response = await api.delete(`/posts/${postId}`);
        return response.data;
    }
};

// User related API calls
export const users = {
    getProfile: async (username) => {
        const response = await api.get(`/users/${username}`);
        return response.data;
    }
};

export default api;