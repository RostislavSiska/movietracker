// app/static/js/pages/login.js
import { authApi, loadCurrentUser } from '../api.js';

export async function renderLogin() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="row justify-content-center">
            <div class="col-md-6 col-lg-4">
                <div class="card shadow">
                    <div class="card-body">
                        <h3 class="card-title text-center mb-4">Вход</h3>
                        <form id="login-form">
                            <div class="mb-3">
                                <label for="username" class="form-label">Имя пользователя</label>
                                <input type="text" class="form-control" id="username" required>
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Пароль</label>
                                <input type="password" class="form-control" id="password" required>
                            </div>
                            <button type="submit" class="btn btn-primary w-100">Войти</button>
                        </form>
                        <div class="text-center mt-3">
                            <a href="/register" id="register-link">Нет аккаунта? Зарегистрируйтесь</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const form = document.getElementById('login-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        try {
            await authApi.login(username, password);
            // После успешного входа перезагружаем текущего пользователя и переходим на главную
            await loadCurrentUser();
            window.location.href = '/';
        } catch (error) {
            alert(error.message);
        }
    });

    // Обработка перехода по ссылке "регистрация" (SPA)
    const registerLink = document.getElementById('register-link');
    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.history.pushState({}, '', '/register');
        // Вызов рендеринга регистрации (он должен быть доступен глобально)
        if (typeof window.renderRegister === 'function') {
            window.renderRegister();
        } else {
            // Если функция не определена, просто перезагрузим страницу
            window.location.href = '/register';
        }
    });
}