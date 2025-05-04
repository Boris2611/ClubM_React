import axios from 'axios';

// Koristi relativni path zbog proxy-ja u package.json
const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// User API calls
export const fetchUserProfile = async () => {
  const response = await api.get('/user/profile');
  return response.data;
};

// Ako šalješ FormData (za upload slike), koristi multipart/form-data
export const updateUserProfile = async (userData) => {
  if (userData instanceof FormData) {
    const response = await api.put('/user/profile', userData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
  const response = await api.put('/user/profile', userData);
  return response.data;
};

// Auth API calls
export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// Feed API calls
export const fetchPosts = async () => {
  const response = await api.get('/feed');
  return response.data;
};

export const createPost = async (data) => {
  if (data instanceof FormData) {
    const response = await api.post('/feed', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
  const response = await api.post('/feed', data);
  return response.data;
};

export const likePost = async (postId) => {
  const response = await api.post(`/feed/${postId}/like`);
  return response.data;
};

export const commentPost = async (postId, comment) => {
  const response = await api.post(`/feed/${postId}/comment`, { comment });
  return response.data;
};

// Menu API calls
export const fetchMenuItems = async () => {
  const response = await api.get('/menu');
  return response.data;
};

export const createMenuItem = async (data) => {
  const response = await api.post('/menu', data);
  return response.data;
};
export const deleteMenuItem = async (id) => {
  const response = await api.delete(`/menu/${id}`);
  return response.data;
};

// Sales API calls
export const fetchSalesItems = async () => {
  const response = await api.get('/sales');
  return response.data;
};

export const createSaleItem = async (data) => {
  const response = await api.post('/sales', data);
  return response.data;
};
export const updateSaleItem = async (id, data) => {
  if (data instanceof FormData) {
    const response = await api.put(`/sales/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
  const response = await api.put(`/sales/${id}`, data);
  return response.data;
};
export const deleteSaleItem = async (id) => {
  const response = await api.delete(`/sales/${id}`);
  return response.data;
};

// Rentals API calls
export const fetchRentalItems = async () => {
  const response = await api.get('/rentals');
  return response.data;
};

// Rentals API calls
export const createRentalItem = async (data) => {
  const response = await api.post('/rentals', data);
  return response.data;
};
export const updateRentalItem = async (id, data) => {
  if (data instanceof FormData) {
    const response = await api.put(`/rentals/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
  const response = await api.put(`/rentals/${id}`, data);
  return response.data;
};
export const deleteRentalItem = async (id) => {
  const response = await api.delete(`/rentals/${id}`);
  return response.data;
};

// Admin API calls
export const fetchAdminData = async () => {
  const response = await api.get('/admin/data');
  return response.data.users || [];
};

export const updatePost = async (postId, data) => {
  const response = await api.put(`/feed/${postId}`, data);
  return response.data;
};

export const deletePost = async (postId) => {
  const response = await api.delete(`/feed/${postId}`);
  return response.data;
};
export const fetchUserProfileById = async (id) => {
  const response = await api.get(`/user/profile/${id}`);
  return response.data;
};

export const updateMenuItem = async (id, data) => {
  if (data instanceof FormData) {
    const response = await api.put(`/menu/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
  const response = await api.put(`/menu/${id}`, data);
  return response.data;
};

export default api;