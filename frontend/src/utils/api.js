import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    withCredentials: true,
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
    create: async (formData) => {
        console.log('Sending data:', {
            content: formData.get('content'),
            image: formData.get('image')
        });
        const response = await api.post('/posts', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    update: async (postId, formData) => {
        console.log('About to send request with:', {
            postId,
            formData: Object.fromEntries(formData.entries()),
            url: `/posts/${postId}`
        });

        const response = await api.put(`/posts/${postId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
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
    },
    search: async (query) => {
        try {
            const response = await api.get(`/users/search/${query}`);
            return response.data;
        } catch (err) {
            console.error('API Search error:', err.response || err);
            throw err;
        }
    },
};

export default api;