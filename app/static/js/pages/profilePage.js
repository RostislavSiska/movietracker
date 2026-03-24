// app/static/js/pages/profilePage.js
import { userApi, getCurrentUser } from '../api.js';
import { renderMovieGrid } from '../components/movieCard.js';

export async function renderProfile(username) {
    const app = document.getElementById('app');
    const currentUser = getCurrentUser();

    // Если username не передан, показываем профиль текущего пользователя
    const profileUsername = username || currentUser?.username;
    if (!profileUsername) {
        app.innerHTML = '<div class="alert alert-warning">Необходимо войти в систему.</div>';
        return;
    }

    app.innerHTML = `
        <div id="profile-info" class="row mb-4">
            <div class="col-md-3 text-center">
                <img src="${currentUser?.avatar || '/static/img/default-avatar.png'}" class="rounded-circle img-fluid" style="max-width: 150px;" alt="Avatar">
            </div>
            <div class="col-md-9">
                <h1>${profileUsername}</h1>
                <p>Дата регистрации: ...</p>
                <div class="stats">
                    <span class="badge bg-primary me-2">Всего фильмов: 0</span>
                    <span class="badge bg-success me-2">Просмотрено: 0</span>
                    <span class="badge bg-warning text-dark me-2">В планах: 0</span>
                    <span class="badge bg-secondary me-2">Брошено: 0</span>
                </div>
                <div class="mt-3">
                    <h5>Любимые жанры:</h5>
                    <p>—</p>
                </div>
                <div>
                    <h5>Общее время просмотра:</h5>
                    <p>0 часов</p>
                </div>
            </div>
        </div>
        <div>
            <ul class="nav nav-tabs" id="profileTabs" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="watched-tab" data-bs-toggle="tab" data-bs-target="#watched" type="button" role="tab">Просмотрено</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="planned-tab" data-bs-toggle="tab" data-bs-target="#planned" type="button" role="tab">В планах</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="dropped-tab" data-bs-toggle="tab" data-bs-target="#dropped" type="button" role="tab">Брошено</button>
                </li>
            </ul>
            <div class="tab-content mt-3" id="profileTabContent">
                <div class="tab-pane fade show active" id="watched" role="tabpanel">
                    <div id="watched-grid" class="row"></div>
                </div>
                <div class="tab-pane fade" id="planned" role="tabpanel">
                    <div id="planned-grid" class="row"></div>
                </div>
                <div class="tab-pane fade" id="dropped" role="tabpanel">
                    <div id="dropped-grid" class="row"></div>
                </div>
            </div>
        </div>
    `;

    // Загружаем статистику и фильмы (заглушка)
    // В реальности нужно вызывать соответствующие эндпоинты
    try {
        const ratings = await userApi.ratings(profileUsername);
        // Группируем по статусу
        const watched = ratings.filter(r => r.status === 'watched');
        const planned = ratings.filter(r => r.status === 'planned');
        const dropped = ratings.filter(r => r.status === 'dropped');

        // Отображаем фильмы в сетках
        renderMovieGrid(watched, 'watched-grid');
        renderMovieGrid(planned, 'planned-grid');
        renderMovieGrid(dropped, 'dropped-grid');

        // Обновляем статистику в шапке
        // (можно добавить отдельный запрос для статистики)
    } catch (error) {
        app.innerHTML += `<div class="alert alert-danger">Ошибка загрузки профиля: ${error.message}</div>`;
    }
}