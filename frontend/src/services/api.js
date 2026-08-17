import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

// Create axios instance with interceptor
const api = axios.create({
  baseURL: API_BASE,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const articleService = {
  // Public endpoints
  getAllArticles: (page = 1, limit = 10, search = '', tag = '') => {
    return api.get('/articles', {
      params: { page, limit, search, tag },
    });
  },

  getArticleBySlug: (slug) => {
    return api.get(`/articles/${slug}`);
  },

  getAllTags: () => {
    return api.get('/articles/tags');
  },

  // Admin endpoints
  createArticle: (data) => {
    return api.post('/articles', data);
  },

  updateArticle: (id, data) => {
    return api.put(`/articles/${id}`, data);
  },

  deleteArticle: (id) => {
    return api.delete(`/articles/${id}`);
  },

  getAdminArticles: (page = 1, limit = 10) => {
    return api.get('/articles/admin/all', {
      params: { page, limit },
    });
  },

  getArticleForEdit: (id) => {
    return api.get(`/articles/admin/${id}`);
  },
};

export const authService = {
  login: (email, password) => {
    return api.post('/auth/login', { email, password });
  },

  verifyToken: () => {
    return api.get('/auth/verify');
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  setToken: (token) => {
    localStorage.setItem('token', token);
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default api;
