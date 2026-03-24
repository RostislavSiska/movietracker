// app/static/js/components/movieCard.js

export function createMovieCard(movie) {
    const posterUrl = movie.poster_url || '/static/img/no-poster.jpg';
    const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '—';
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '—';

    const card = document.createElement('div');
    card.className = 'col';
    card.innerHTML = `
        <div class="card h-100 movie-card" data-movie-id="${movie.id}">
            <img src="${posterUrl}" class="card-img-top" alt="${movie.title}">
            <div class="card-body">
                <h5 class="card-title">${movie.title}</h5>
                <p class="card-text text-muted">${year}</p>
                <p class="card-text">
                    <span class="badge bg-warning text-dark">⭐ ${rating}</span>
                </p>
            </div>
        </div>
    `;

    // Добавляем обработчик клика для перехода на страницу фильма (пока заглушка)
    card.addEventListener('click', () => {
        console.log('Переход к фильму', movie.id);
        // Здесь можно реализовать переход на страницу фильма (SPA)
    });

    return card;
}

// Функция для отображения сетки фильмов
export function renderMovieGrid(movies, containerId = 'app') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="row row-cols-1 row-cols-md-3 row-cols-lg-5 g-4">
        </div>
    `;
    const row = container.querySelector('.row');
    movies.forEach(movie => {
        row.appendChild(createMovieCard(movie));
    });
}