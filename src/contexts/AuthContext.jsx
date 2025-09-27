import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Adicionar propriedade isAuthenticated
  const isAuthenticated = !!user;

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Tentando login com:', { email, password });
      
      const response = await api.post('/auth/login', {
        email,
        password
      });

      console.log('Resposta da API:', response.data);

      if (response.data.data && response.data.data.token && response.data.data.user) {
        const { token, user: userData } = response.data.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
        return { success: true };
      } else {
        throw new Error('Resposta da API inválida');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      
      let errorMessage = 'Erro ao fazer login';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        console.log('Status do erro:', status);
        console.log('Dados do erro:', data);
        
        if (status === 422) {
          if (data && data.message) {
            errorMessage = data.message;
          } else if (data && data.errors) {
            const errors = Object.values(data.errors).flat();
            errorMessage = errors.join(', ');
          } else {
            errorMessage = 'Email ou senha inválidos';
          }
        } else if (status === 401) {
          errorMessage = 'Credenciais incorretas';
        } else if (data && data.message) {
          errorMessage = data.message;
        } else {
          errorMessage = `Erro do servidor (${status})`;
        }
      } else if (error.request) {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      console.log('Dados recebidos para registro:', userData);
      
      // Verificar se o telefone já vem como número ou como string
      let phoneNumber;
      
      // Primeiro, obter o valor do telefone como string
      let phoneString = '';
      if (userData.phone_number) {
        phoneString = userData.phone_number.toString();
      } else if (userData.phone) {
        phoneString = userData.phone.toString();
      } else {
        throw new Error('Telefone é obrigatório');
      }
      
      // Remove toda formatação (parênteses, espaços, hífens, +)
      const cleanPhone = phoneString.replace(/\D/g, '');
      
      let finalPhone = cleanPhone;
      
      // Se o telefone já tem 13 dígitos (com código do país), usar como está
      if (cleanPhone.length === 13) {
        finalPhone = cleanPhone;
      }
      // Se tem 11 dígitos (celular sem código do país), adicionar 55
      else if (cleanPhone.length === 11) {
        finalPhone = '55' + cleanPhone;
      }
      // Se tem 10 dígitos (fixo sem código do país), adicionar 55
      else if (cleanPhone.length === 10) {
        finalPhone = '55' + cleanPhone;
      }
      // Se tem 12 dígitos, pode ser que já tenha 55 mas esteja faltando um dígito
      else if (cleanPhone.length === 12) {
        // Verificar se começa com 55
        if (cleanPhone.startsWith('55')) {
          finalPhone = '55' + cleanPhone.substring(2);
        } else {
          finalPhone = '55' + cleanPhone;
        }
      }
      else {
        throw new Error('Telefone deve ter 10, 11, 12 ou 13 dígitos');
      }
      
      // Validar se o telefone final tem 13 dígitos
      if (finalPhone.length !== 13) {
        throw new Error('Erro na formatação do telefone');
      }
      
      // Converter para número
      phoneNumber = parseInt(finalPhone, 10);

      // Preparar dados para envio
      const requestData = {
        name: userData.name,
        phone_number: phoneNumber,
        email: userData.email,
        password: userData.password,
        password_confirmation: userData.password_confirmation,
        role: userData.role
      };

      // Adicionar campos condicionais baseados no role
      if (userData.role === 'COMPANY') {
        if (!userData.company_name || !userData.cnpj) {
          throw new Error('Nome da empresa e CNPJ são obrigatórios para empresas');
        }
        requestData.company_name = userData.company_name;
        // Remove formatação do CNPJ antes de enviar
        requestData.cnpj = userData.cnpj.replace(/\D/g, '');
      } else if (userData.role === 'ARCHITECT') {
        if (!userData.company_name) {
          throw new Error('Nome da empresa é obrigatório para arquitetos');
        }
        requestData.company_name = userData.company_name;
      }

      console.log('Dados formatados para envio:', requestData);

      const response = await api.post('/auth/register', requestData);

      console.log('Resposta da API:', response.data);

      if (response.data.data && response.data.data.token && response.data.data.user) {
        const { token, user: newUser } = response.data.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
        
        return { success: true };
      } else {
        throw new Error('Resposta da API inválida');
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      
      let errorMessage = 'Erro ao criar conta';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        console.log('Status do erro:', status);
        console.log('Dados do erro:', data);
        
        if (status === 422) {
          if (data && data.message) {
            errorMessage = data.message;
          } else if (data && data.errors) {
            const errors = Object.values(data.errors).flat();
          } else {
            errorMessage = 'Dados inválidos fornecidos';
          }
        } else if (data && data.message) {
          errorMessage = data.message;
        } else {
          errorMessage = `Erro do servidor (${status})`;
        }
      } else if (error.request) {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated, // Adicionar propriedade isAuthenticated
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
