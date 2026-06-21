import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const { data } = await axios.post(`${API_URL}/auth/refresh/`, {
            refresh: refreshToken,
          });
          localStorage.setItem('access_token', data.access);
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return api(originalRequest);
        }
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// API helper functions
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login/', { email, password }),
  register: (data: Record<string, string>) =>
    api.post('/auth/register/', data),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data: Record<string, unknown>) =>
    api.patch('/auth/profile/', data),
  resetPassword: (email: string) =>
    api.post('/auth/password-reset/', { email }),
};

export const equipmentAPI = {
  list: (params?: Record<string, string>) =>
    api.get('/equipment/', { params }),
  getBySlug: (slug: string) =>
    api.get(`/equipment/${slug}/`),
  create: (data: any) =>
    api.post('/equipment/', data),
  update: (slug: string, data: any) =>
    api.patch(`/equipment/${slug}/`, data),
  getCategories: () =>
    api.get('/equipment/categories/'),
  getAvailability: (id: string, date: string) =>
    api.get(`/equipment/${id}/availability/`, { params: { date } }),
  delete: (slug: string) =>
    api.delete(`/equipment/${slug}/`),
};

export const bookingAPI = {
  list: (params?: Record<string, string>) =>
    api.get('/bookings/', { params }),
  create: (data: Record<string, unknown>) =>
    api.post('/bookings/', data),
  getById: (id: string) =>
    api.get(`/bookings/${id}/`),
  approve: (id: string, notes?: string) =>
    api.post(`/bookings/${id}/approve/`, { admin_notes: notes }),
  reject: (id: string, notes?: string) =>
    api.post(`/bookings/${id}/reject/`, { admin_notes: notes }),
  cancel: (id: string) =>
    api.post(`/bookings/${id}/cancel/`),
  calendar: (params: Record<string, string>) =>
    api.get('/bookings/calendar/', { params }),
};

export const projectAPI = {
  list: (params?: Record<string, string>) =>
    api.get('/projects/', { params }),
  getBySlug: (slug: string) =>
    api.get(`/projects/${slug}/`),
  create: (data: any) =>
    api.post('/projects/', data),
  update: (slug: string, data: any) =>
    api.patch(`/projects/${slug}/`, data),
  getCategories: () =>
    api.get('/projects/categories/'),
  delete: (slug: string) =>
    api.delete(`/projects/${slug}/`),
};

export const eventAPI = {
  list: (params?: Record<string, string>) =>
    api.get('/events/', { params }),
  getBySlug: (slug: string) =>
    api.get(`/events/${slug}/`),
  create: (data: any) =>
    api.post('/events/', data),
  update: (slug: string, data: any) =>
    api.patch(`/events/${slug}/`, data),
  register: (id: string) =>
    api.post(`/events/${id}/register/`),
  myEvents: () =>
    api.get('/events/my/'),
  delete: (slug: string) =>
    api.delete(`/events/${slug}/`),
};

export const trainingAPI = {
  listCourses: () =>
    api.get('/training/courses/'),
  getCourse: (slug: string) =>
    api.get(`/training/courses/${slug}/`),
  createCourse: (data: any) =>
    api.post('/training/courses/', data),
  updateCourse: (slug: string, data: any) =>
    api.patch(`/training/courses/${slug}/`, data),
  updateProgress: (courseId: string, lessonId: string) =>
    api.post(`/training/courses/${courseId}/progress/`, { lesson_id: lessonId }),
  submitQuiz: (courseId: string, answers: number[]) =>
    api.post(`/training/courses/${courseId}/quiz/`, { answers }),
  myProgress: () =>
    api.get('/training/my-progress/'),
  deleteCourse: (slug: string) =>
    api.delete(`/training/courses/${slug}/`),
};

export const certificateAPI = {
  list: () => api.get('/certificates/'),
  verify: (id: string) =>
    api.get(`/certificates/verify/${id}/`),
};

export const resourceAPI = {
  list: (params?: Record<string, string>) =>
    api.get('/resources/', { params }),
  create: (data: any) =>
    api.post('/resources/', data),
  update: (id: string, data: any) =>
    api.patch(`/resources/${id}/`, data),
  getCategories: () =>
    api.get('/resources/categories/'),
  download: (id: string) =>
    api.get(`/resources/${id}/download/`, { responseType: 'blob' }),
  delete: (id: string) =>
    api.delete(`/resources/${id}/`),
};

export const notificationAPI = {
  list: () => api.get('/notifications/'),
  markRead: (id: string) =>
    api.post(`/notifications/${id}/read/`),
  markAllRead: () =>
    api.post('/notifications/mark-all-read/'),
  unreadCount: () =>
    api.get('/notifications/unread-count/'),
};

export const analyticsAPI = {
  dashboard: () => api.get('/analytics/dashboard/'),
  bookings: () => api.get('/analytics/bookings/'),
  equipment: () => api.get('/analytics/equipment/'),
  publicStats: () => api.get('/analytics/public-stats/'),
  submitContact: (data: Record<string, string>) =>
    api.post('/analytics/contact/', data),
};
