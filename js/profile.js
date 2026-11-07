'use strict';

// ============================================================
//  Элементы страницы
// ============================================================
const loading = document.getElementById('loading');
const profile = document.getElementById('profile');
const photo = document.getElementById('photo');
const nameEl = document.getElementById('name');
const emailEl = document.getElementById('email');
const ageEl = document.getElementById('age');
const cityEl = document.getElementById('city');
const logoutBtn = document.getElementById('logout-btn');

// ============================================================
//  Задача 4: выход — удалить токены и вернуться на вход
// ============================================================
function logout() {
  removeTokens();
  window.location.replace('login.html');
}

logoutBtn.addEventListener('click', logout);

// ============================================================
//  Запрос профиля с токеном в заголовке Authorization: Bearer
// ============================================================
function fetchMe(token) {
  return axios.get(`${API_URL}/auth/me`, {
    headers: { Authorization: 'Bearer ' + token },
  });
}

// ============================================================
//  Задача 5: обновление токена через refresh
// ============================================================
async function refreshTokens() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('Нет refresh-токена');

  const response = await axios.post(`${API_URL}/auth/refresh`, {
    refreshToken,
  });

  saveTokens(response.data.accessToken, response.data.refreshToken);
  return response.data.accessToken;
}

// Вывод данных пользователя на страницу
function renderProfile(user) {
  photo.src = user.image;
  nameEl.textContent = `${user.firstName} ${user.lastName}`;
  emailEl.textContent = user.email;
  ageEl.textContent = user.age;
  cityEl.textContent = user.address?.city || '—';

  loading.hidden = true;
  profile.hidden = false;
}

// ============================================================
//  Задача 3: загрузка профиля
// ============================================================
async function loadProfile() {
  const token = getAccessToken();

  // Нет токена — на страницу входа
  if (!token) {
    window.location.replace('login.html');
    return;
  }

  try {
    const response = await fetchMe(token);
    renderProfile(response.data);
  } catch (error) {
    // Задача 4/5: 401 — сначала пробуем обновить токен
    if (error.response && error.response.status === 401) {
      try {
        const newToken = await refreshTokens();
        const response = await fetchMe(newToken); // повторяем запрос
        renderProfile(response.data);
      } catch {
        // Обновить не получилось — выход
        logout();
      }
    } else {
      loading.textContent = 'Не удалось загрузить профиль';
    }
  }
}

loadProfile();
