'use strict';

// ============================================================
//  Задача 2: если пользователь уже вошёл — сразу на профиль
// ============================================================
if (getAccessToken()) {
  window.location.replace('profile.html');
}

// ============================================================
//  Элементы страницы
// ============================================================
const form = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const usernameError = document.getElementById('username-error');
const passwordError = document.getElementById('password-error');
const formMessage = document.getElementById('form-message');
const loginBtn = document.getElementById('login-btn');

// ============================================================
//  Проверка полей: пустое поле — ошибка под ним
// ============================================================
function validate(username, password) {
  let isValid = true;

  usernameError.textContent = '';
  passwordError.textContent = '';
  usernameInput.classList.remove('is-invalid');
  passwordInput.classList.remove('is-invalid');

  if (username === '') {
    usernameError.textContent = 'Введите логин';
    usernameInput.classList.add('is-invalid');
    isValid = false;
  }

  if (password === '') {
    passwordError.textContent = 'Введите пароль';
    passwordInput.classList.add('is-invalid');
    isValid = false;
  }

  return isValid;
}

// Блокировка кнопки на время запроса
function setLoading(isLoading) {
  loginBtn.disabled = isLoading;
  loginBtn.textContent = isLoading ? 'Вход...' : 'Войти';
}

// ============================================================
//  Задача 1: отправка формы
// ============================================================
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  formMessage.textContent = '';

  // Пустые поля — запрос не отправляем
  if (!validate(username, password)) return;

  setLoading(true);

  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password,
    });

    // Задача 2: берём токены из ответа и сохраняем
    const { accessToken, refreshToken } = response.data;
    saveTokens(accessToken, refreshToken);

    // Переход на профиль
    window.location.href = 'profile.html';
  } catch (error) {
    // Сервер ответил ошибкой (400/401) — неверные данные
    if (error.response) {
      formMessage.textContent = 'Неверный логин или пароль';
    } else {
      formMessage.textContent = 'Ошибка сети. Попробуйте ещё раз';
    }
    setLoading(false);
  }
});

// Убираем ошибку под полем, как только пользователь начал вводить
usernameInput.addEventListener('input', () => {
  usernameError.textContent = '';
  usernameInput.classList.remove('is-invalid');
});

passwordInput.addEventListener('input', () => {
  passwordError.textContent = '';
  passwordInput.classList.remove('is-invalid');
});
