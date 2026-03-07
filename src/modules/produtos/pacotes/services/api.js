import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: `${API_BASE_URL}/pacotes`,
});

// Adiciona o token JWT a cada requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const pacotesService = {
  // Listar todos os pacotes
  list: async () => {
    try {
      const response = await api.get('');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Obter um pacote específico
  getById: async (pacoteId) => {
    try {
      const response = await api.get(`/${pacoteId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Criar um novo pacote
  create: async (pacoteData) => {
    try {
      const response = await api.post('', pacoteData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Atualizar um pacote
  update: async (pacoteId, pacoteData) => {
    try {
      const response = await api.put(`/${pacoteId}`, pacoteData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Deletar um pacote
  delete: async (pacoteId) => {
    try {
      const response = await api.delete(`/${pacoteId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default pacotesService;
