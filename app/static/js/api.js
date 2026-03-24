// app/static/js/api.js

const API_BASE = 'http://localhost:8000';; // или 'http://localhost:8000/api' если фронтенд отдельно

// Вспомогательная функция для запросов с авторизацией
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

// Функции для фильмов
export const moviesApi = {
    search: (query, page = 1) => apiRequest(`/movies/search?query=${encodeURIComponent(query)}&page=${page}`),
    popular: (page = 1) => apiRequest(`/movies/popular?page=${page}`),
    details: (id) => apiRequest(`/movies/${id}`),
};

// Функции для пользователя (пример)
export const userApi = {
    profile: (username) => apiRequest(`/users/${username}`),
    ratings: (username, status = '') => apiRequest(`/users/${username}/ratings${status ? `?status=${status}` : ''}`),
};

// Функции для аутентификации
export const authApi = {
    login: (username, password) => apiRequest('/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username, password }),
    }),
    register: (userData) => apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    }),
    me: () => apiRequest('/auth/me'),
};

// Хранилище текущего пользователя
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