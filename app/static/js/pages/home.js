// app/static/js/pages/home.js
import { moviesApi } from '../api.js';
import { renderMovieGrid } from '../components/movieCard.js';

export async function renderHome() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="row mb-4">
            <div class="col">
                <h1>Добро пожаловать в Movie Tracker</h1>
                <p>Отслеживайте просмотренные фильмы и открывайте новое кино.</p>
            </div>
        </div>
        <div class="row mb-4">
            <div class="col-md-6">
                <div class="input-group">
                    <input type="text" class="form-control" id="search-input" placeholder="Введите название фильма...">
                    <button class="btn btn-primary" type="button" id="search-btn">Поиск</button>
                </div>
            </div>
        </div>
        <div id="search-results" style="display: none;">
            <h2>Результаты поиска</h2>
            <div id="search-results-grid"></div>
        </div>
        <div id="popular">
            <h2>Популярные фильмы</h2>
            <div id="popular-grid"></div>
        </div>
    `;

    // Загружаем популярные фильмы
    try {
        const popular = await moviesApi.popular();
        const popularContainer = document.getElementById('popular-grid');
        renderMovieGrid(popular.results || popular, 'popular-grid');
    } catch (error) {
        document.getElementById('popular-grid').innerHTML = `<div class="alert alert-danger">Ошибка загрузки популярных фильмов: ${error.message}</div>`;
    }

    // Обработка поиска
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const searchResultsDiv = document.getElementById('search-results');

    searchBtn.addEventListener('click', async () => {
        const query = searchInput.value.trim();
        if (!query) return;

        searchResultsDiv.style.display = 'block';
        const grid = document.getElementById('search-results-grid');
        grid.innerHTML = '<div class="spinner-border text-primary"></div>';

        try {
            const results = await moviesApi.search(query);
            if (results.results.length === 0) {
                grid.innerHTML = '<p class="text-muted">Ничего не найдено.</p>';
            } else {
                renderMovieGrid(results.results, 'search-results-grid');
            }
        } catch (error) {
            grid.innerHTML = `<div class="alert alert-danger">Ошибка: ${error.message}</div>`;
        }
    });

    // Поиск при нажатии Enter
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
}