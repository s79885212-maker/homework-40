'use strict';

// ============================================================
//  Общие функции для работы с токенами (используются на обеих страницах)
// ============================================================
const API_URL = 'https://dummyjson.com';

// Сохранить оба токена в localStorage
function saveTokens(accessToken, refreshToken) {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
}

// Получить access-токен
function getAccessToken() {
  return localStorage.getItem('accessToken');
}

// Получить refresh-токен
function getRefreshToken() {
  return localStorage.getItem('refreshToken');
}

// Удалить оба токена (выход)
function removeTokens() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}
