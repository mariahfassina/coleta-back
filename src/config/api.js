// src/config/api.js

import axios from 'axios';

// Instância para chamadas PÚBLICAS (nunca envia token)
export const apiPublic = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Instância para chamadas PRIVADAS (sempre envia token se existir)
export const apiPrivate = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// O "segurança" que só trabalha para a instância privada
apiPrivate.interceptors.request.use(config => {
  const token = localStorage.getItem('user_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// A exportação padrão continua sendo a privada para não quebrar os arquivos de admin.
export default apiPrivate;