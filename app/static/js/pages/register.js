// app/static/js/pages/register.js
import { authApi, loadCurrentUser } from '../api.js';

export async function renderRegister() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="row justify-content-center">
            <div class="col-md-6 col-lg-4">
                <div class="card shadow">
                    <div class="card-body">
                        <h3 class="card-title text-center mb-4">Регистрация</h3>
                        <form id="register-form">
                            <div class="mb-3">
                                <label for="username" class="form-label">Имя пользователя</label>
                                <input type="text" class="form-control" id="username" required minlength="3">
                            </div>
                            <div class="mb-3">
                                <label for="email" class="form-label">Email</label>
                                <input type="email" class="form-control" id="email" required>
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Пароль</label>
                                <input type="password" class="form-control" id="password" required minlength="6">
                            </div>
                            <button type="submit" class="btn btn-primary w-100">Зарегистрироваться</button>
                        </form>
                        <div class="text-center mt-3">
                            <a href="/login" id="login-link">Уже есть аккаунт? Войдите</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const form = document.getElementById('register-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        try {
            await authApi.register(username, email, password);
            alert('Регистрация прошла успешно! Теперь войдите.');
            window.location.href = '/login';
        } catch (error) {
            alert(error.message);
        }
    });

    const loginLink = document.getElementById('login-link');
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.history.pushState({}, '', '/login');
        if (typeof window.renderLogin === 'function') {
            window.renderLogin();
        } else {
            window.location.href = '/login';
        }
    });
}