import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('elo-vet-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('elo-vet-token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const loginUser = (payload) => api.post('/auth/login', payload);
export const registerUser = (payload) => api.post('/auth/register', payload);

export const getPets = () => api.get('/pet');
export const getPetById = (id) => api.get(`/pet/${id}`);
export const createPet = (payload) => api.post('/pet', payload);
export const updatePet = (id, payload) => api.put(`/pet/${id}`, payload);
export const deletePet = (id) => api.delete(`/pet/${id}`);

export const getVeterinaries = () => api.get('/veterinary');
export const getVeterinaryById = (id) => api.get(`/veterinary/${id}`);
export const createVeterinary = (payload) => api.post('/veterinary', payload);
export const updateVeterinary = (id, payload) => api.put(`/veterinary/${id}`, payload);
export const deleteVeterinary = (id) => api.delete(`/veterinary/${id}`);

export const getUsers = () => api.get('/users');

export const createCarePlan = (vetId, payload) => api.post(`/veterinaries/${vetId}/care-plans`, payload);
export const getCarePlansByUser = (userId) => api.get(`/users/${userId}/care-plans`);
export const markCarePlanItem = (carePlanId, itemId, payload) =>
  api.post(`/care-plans/${carePlanId}/items/${itemId}/mark`, payload);

export default api;
