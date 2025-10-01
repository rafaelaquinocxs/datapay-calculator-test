import axios from 'axios';

// Configuração da API DataPay
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://calculadora-datapay-3ce68cb10e28.herokuapp.com/api';

// Criar instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 segundos
});

// Interceptor para logs de requisições
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para logs de respostas
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// Serviços da API DataPay
const apiServiceInternal = {
  // Health check
  async healthCheck() {
    try {
      const response = await api.get("/health");
      return response.data;
    } catch (error) {
      console.error("Health check failed:", error);
      throw error;
    }
  },

  // Iniciar nova calculação
  async startCalculation(formData = {}) {
    try {
      const response = await api.post("/calculations/start", formData);
      return response.data;
    } catch (error) {
      console.error("Failed to start calculation:", error);
      throw error;
    }
  },

  // Atualizar dados da calculação
  async updateCalculation(calculationId, formData) {
    try {
      const response = await api.put(`/calculations/${calculationId}/update`, formData);
      return response.data;
    } catch (error) {
      console.error("Failed to update calculation:", error);
      throw error;
    }
  },

  // Calcular valor final
  async calculateValue(calculationId) {

    try {
      const response = await api.post(`/calculations/${calculationId}/calculate`);
      return response.data;
    } catch (error) {
      console.error("Failed to calculate value:", error);
      throw error;
    }
  },

  // Buscar calculação por ID
  async getCalculation(calculationId) {
    try {
      const response = await api.get(`/calculations/${calculationId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to get calculation:", error);
      throw error;
    }
  },

  // Obter estatísticas gerais
  async getStatistics() {
    try {
      const response = await api.get("/statistics");
      return response.data;
    } catch (error) {
      console.error("Failed to get statistics:", error);
      throw error;
    }
  }
};

export const apiService = apiServiceInternal;



