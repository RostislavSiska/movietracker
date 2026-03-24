// app/static/js/main.js
import { renderHome } from './pages/home.js';
import { renderProfile } from './pages/profilePage.js';
import { renderLogin } from './pages/login.js';
import { renderRegister } from './pages/register.js';
import { loadCurrentUser, getCurrentUser, authApi } from './api.js';

// Храним ссылку на функцию поиска (будет загружена лениво)
let renderSearchResultsFn = null;

// Маршруты
const routes = {
    '/': renderHome,
    '/login': renderLogin,
    '/register': renderRegister,
    '/profile/:username': (params) => renderProfile(params.username),
    '/profile': () => renderProfile(),
    '/search': async () => {
        // Извлекаем параметр q из URL
        const params = new URLSearchParams(window.location.search);
        const q = params.get('q');
        if (q && q.trim()) {
            if (!renderSearchResultsFn) {
                const module = await import('./pages/home.js');
                renderSearchResultsFn = module.renderSearchResults;
            }
            await renderSearchResultsFn(q);
        } else {
            await renderHome();
        }
    },
};

async function router() {
    const path = window.location.pathname;
    const app = document.getElementById('app');
    app.innerHTML = '<div class="text-center"><div class="spinner-border text-primary"></div></div>';

    await loadCurrentUser();
    updateNav();

    let matchedRoute = null;
    let params = {};

    for (const route in routes) {
        if (route.includes(':')) {
            const pattern = route.replace(/:\w+/g, '([^/]+)');
            const regex = new RegExp(`^${pattern}$`);
            const match = path.match(regex);
            if (match) {
                matchedRoute = routes[route];
                const keys = route.match(/:\w+/g) || [];
                keys.forEach((key, idx) => {
                    params[key.slice(1)] = match[idx + 1];
                });
                break;
            }
        } else if (route === path) {
            matchedRoute = routes[route];
            break;
        }
    }

    if (matchedRoute) {
        try {
            await matchedRoute(params);
        } catch (error) {
            app.innerHTML = `<div class="alert alert-danger">Ошибка: ${error.message}</div>`;
        }
    } else {
        app.innerHTML = '<h1>404 - Страница не найдена</h1>';
    }
}

function updateNav() {
    const navLinks = document.getElementById('nav-links');
    const user = getCurrentUser();
    if (user) {
        navLinks.innerHTML = `
            <li class="nav-item"><a class="nav-link" href="/profile/${user.username}">${user.username}</a></li>
            <li class="nav-item"><a class="nav-link" href="#" id="logout">Выйти</a></li>
        `;
        const logoutBtn = document.getElementById('logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                authApi.logout();
                loadCurrentUser().then(() => {
                    window.location.href = '/';
                });
            });
        }
    } else {
        navLinks.innerHTML = `
            <li class="nav-item"><a class="nav-link" href="/login">Вход</a></li>
            <li class="nav-item"><a class="nav-link" href="/register">Регистрация</a></li>
        `;
    }
}

// Обработка формы поиска
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    if (searchForm) {
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (!query) return;

            // Лениво загружаем функцию поиска, если ещё не загружена
            if (!renderSearchResultsFn) {
                const module = await import('./pages/home.js');
                renderSearchResultsFn = module.renderSearchResults;
            }
            // Вызываем рендер результатов
            await renderSearchResultsFn(query);
            // Меняем URL, чтобы можно было поделиться или обновить страницу
            window.history.pushState({}, '', `/search?q=${encodeURIComponent(query)}`);
        });
    }
});

// Обработка кликов по ссылкам (SPA)
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.href && link.href.startsWith(window.location.origin)) {
        e.preventDefault();
        const url = new URL(link.href);
        if (url.pathname !== window.location.pathname || url.search !== window.location.search) {
            window.history.pushState({}, '', url.pathname + url.search);
            router();
        }
    }
});

window.addEventListener('popstate', router);

// Старт
router();