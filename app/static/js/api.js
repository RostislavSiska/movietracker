// app/static/js/api.js

// Определяем базовый URL в зависимости от окружения
const API_BASE = '/api';


async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers,
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || 'Ошибка запроса');
        }
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

export const moviesApi = {
    search: (query, page = 1) => apiRequest(`/movies/search?query=${encodeURIComponent(query)}&page=${page}`),
    popular: (page = 1) => apiRequest(`/movies/popular?page=${page}`),
    details: (id) => apiRequest(`/movies/${id}`),
};

export const userApi = {
    profile: (username) => apiRequest(`/users/${username}`),
    ratings: (username, status = '') => apiRequest(`/users/${username}/ratings${status ? `?status=${status}` : ''}`),
    stats: (username) => apiRequest(`/users/${username}/stats`),
};

export const authApi = {
    register: async (username, email, password) => {
        return apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password }),
        });
    },
    login: async (username, password) => {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);
        const response = await fetch(`${API_BASE}/auth/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData,
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || 'Ошибка входа');
        }
        localStorage.setItem('token', data.access_token);
        return data;
    },
    me: () => apiRequest('/auth/me'),
    logout: () => {
        localStorage.removeItem('token');
    },
};

let currentUser = null;

export async function loadCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) {
        currentUser = null;
        return null;
    }
    try {
        currentUser = await authApi.me();
        return currentUser;
    } catch {
        localStorage.removeItem('token');
        currentUser = null;
        return null;
    }
}

export function getCurrentUser() {
    return currentUser;
}