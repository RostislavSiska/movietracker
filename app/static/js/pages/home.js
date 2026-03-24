// app/static/js/pages/home.js
import { moviesApi } from '../api.js';
import { renderMovieGrid } from '../components/movieCard.js';

// Отображает популярные фильмы (используется при загрузке главной)
export async function renderHome() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div id="popular">
            <h2>Популярные фильмы</h2>
            <div id="popular-grid"></div>
        </div>
    `;
    try {
        const popular = await moviesApi.popular();
        const movies = popular.results || popular;
        renderMovieGrid(movies, 'popular-grid');
    } catch (error) {
        document.getElementById('popular-grid').innerHTML = `<div class="alert alert-danger">Ошибка загрузки: ${error.message}</div>`;
    }
}

// Отображает результаты поиска (вызывается из navbar)
export async function renderSearchResults(query) {
    const app = document.getElementById('app');
    app.innerHTML = `
        <h2>Результаты поиска: ${escapeHtml(query)}</h2>
        <div id="search-results-grid"></div>
    `;
    try {
        const data = await moviesApi.search(query);
        const results = data.results || data;
        if (results.length === 0) {
            document.getElementById('search-results-grid').innerHTML = '<p class="text-muted">Ничего не найдено.</p>';
            return;
        }
        renderMovieGrid(results, 'search-results-grid');
    } catch (error) {
        document.getElementById('search-results-grid').innerHTML = `<div class="alert alert-danger">Ошибка: ${error.message}</div>`;
    }
}

// Простая защита от XSS
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}