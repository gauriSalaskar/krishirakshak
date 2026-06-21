import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api

// Auth
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }),
}

// Reports
export const reportsAPI = {
  create: (data: FormData) =>
    api.post('/reports', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAll: () => api.get('/reports'),
  getHeatmap: () => api.get('/heatmap'),
}

// Predict
export const predictAPI = {
  predict: (formData: FormData) =>
    api.post('/predict', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
}

// Alerts
export const alertsAPI = {
  getAll: () => api.get('/alerts'),
}

// Community
export const communityAPI = {
  getPosts: () => api.get('/community'),
  createPost: (data: FormData) =>
    api.post('/community', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  likePost: (id: string) => api.post(`/community/${id}/like`),
  addComment: (id: string, content: string) =>
    api.post(`/community/${id}/comment`, { content }),
}

// Dashboard
export const dashboardAPI = {
  getData: () => api.get('/dashboard'),
}

// Schemes
export const schemesAPI = {
  getAll: (params?: { category?: string; state?: string; search?: string }) =>
    api.get('/schemes', { params }),
  getById: (id: string) => api.get(`/schemes/${id}`),
  save: (schemeId: string) => api.post('/schemes/save', { schemeId }),
  getSaved: () => api.get('/schemes/saved'),
  checkEligibility: (data: { landSize: number; state: string; cropType: string; income: number }) =>
    api.post('/schemes/eligibility', data),
  askAI: (question: string, history: { role: string; content: string }[], lang?: string) =>
    api.post('/schemes/ask', { question, history, lang }),
}

// Profile
export const profileAPI = {
  get: () => api.get('/profile'),
}

// Weather (cached server-side in MongoDB to avoid hammering Open-Meteo)
export const weatherAPI = {
  get: (lat: number, lon: number) =>
    api.get('/weather', { params: { lat, lon } }),
}
