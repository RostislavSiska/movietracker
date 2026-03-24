// app/static/js/main.js
import { renderHome } from './pages/home.js';
import { renderProfile } from './pages/profilePage.js';
import { loadCurrentUser, getCurrentUser } from './api.js';

// Простая маршрутизация
const routes = {
    '/': renderHome,
    '/profile/:username': (params) => renderProfile(params.username),
    '/profile': () => renderProfile(), // профиль текущего пользователя
    // можно добавить /login, /register и т.д.
};

async function router() {
    const path = window.location.pathname;
    const app = document.getElementById('app');
    app.innerHTML = '<div class="text-center"><div class="spinner-border text-primary"></div></div>';

    // Загружаем информацию о текущем пользователе при каждом переходе
    await loadCurrentUser();

    // Обновляем навигационную панель (логин/логаут)
    updateNav();

    // Поиск подходящего маршрута
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
                keys.forEach((key, index) => {
                    params[key.slice(1)] = match[index + 1];
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
        document.getElementById('logout').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            loadCurrentUser().then(() => {
                window.location.href = '/';
            });
        });
    } else {
        navLinks.innerHTML = `
            <li class="nav-item"><a class="nav-link" href="/login">Вход</a></li>
            <li class="nav-item"><a class="nav-link" href="/register">Регистрация</a></li>
        `;
    }
}

// Обработка переходов по ссылкам (SPA)
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.href && link.href.startsWith(window.location.origin)) {
        e.preventDefault();
        const url = new URL(link.href);
        if (url.pathname !== window.location.pathname) {
            window.history.pushState({}, '', url.pathname);
            router();
        }
    }
});

// Обработка кнопок назад/вперёд
window.addEventListener('popstate', router);

// Стартуем
router();