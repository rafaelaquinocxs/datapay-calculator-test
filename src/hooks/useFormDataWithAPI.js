import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const useFormDataWithAPI = () => {
  const [formData, setFormData] = useState({
    personalInfo: {},
    digitalHabits: {
      usageFrequency: 5  // Valor padrão
    },
    consumption: {},
    health: {},
    advanced: {}
  });

  const [calculationSession, setCalculationSession] = useState({
    sessionId: null,
    calculationId: null,
    isLoading: false,
    error: null
  });

  const [calculationResult, setCalculationResult] = useState(null);

  // Inicializar sessão da calculadora
  const initializeSession = async () => {
    try {
      setCalculationSession(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await apiService.startCalculation();
      
      if (response.success) {
        setCalculationSession(prev => ({
          ...prev,
          sessionId: response.session_id,
          calculationId: response.calculation_id,
          isLoading: false
        }));
        
        // Salvar no localStorage para persistência
        localStorage.setItem('datapay_session', JSON.stringify({
          sessionId: response.session_id,
          calculationId: response.calculation_id
        }));
        
        return response;
      } else {
        throw new Error(response.error || 'Erro ao inicializar sessão');
      }
    } catch (error) {
      setCalculationSession(prev => ({
        ...prev,
        isLoading: false,
        error: error.message
      }));
      alert(`Erro na calculateFinalValue: ${error.message}`);
      throw error;
    }
  };

  // Restaurar sessão do localStorage
  const restoreSession = () => {
    try {
      const savedSession = localStorage.getItem('datapay_session');
      if (savedSession) {
        const session = JSON.parse(savedSession);
        setCalculationSession(prev => ({
          ...prev,
          sessionId: session.sessionId,
          calculationId: session.calculationId
        }));
        return session;
      }
    } catch (error) {
      console.error('Erro ao restaurar sessão:', error);
    }
    return null;
  };

  // Atualizar dados no backend
  const updateBackendData = async (newFormData) => {
    if (!calculationSession.calculationId) {
      console.warn('Nenhuma sessão ativa para atualizar');
      return;
    }

    try {
      await apiService.updateCalculation(calculationSession.calculationId, newFormData);
    } catch (error) {
      console.error('Erro ao atualizar dados no backend:', error);
      setCalculationSession(prev => ({
        ...prev,
        error: error.message
      }));
    }
  };

  // Atualizar dados do formulário
  const updateFormData = (section, data) => {
    const newFormData = {
      ...formData,
      [section]: { ...formData[section], ...data }
    };
    
    setFormData(newFormData);
    
    // Atualizar no backend de forma assíncrona
    updateBackendData(newFormData);
  };

  // Calcular valor final
  const calculateFinalValue = async () => {
    if (!calculationSession.calculationId) {
      throw new Error('Nenhuma sessão ativa');
    }

    try {
      setCalculationSession(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await apiService.calculateValue(calculationSession.calculationId);
      
      if (response.success) {
        setCalculationResult(response.result);
        setCalculationSession(prev => ({ ...prev, isLoading: false }));
        return response.result;
      } else {
        throw new Error(response.error || 'Erro ao calcular valor');
      }
    } catch (error) {
      setCalculationSession(prev => ({
        ...prev,
        isLoading: false,
        error: error.message
      }));
      alert(`Erro na calculateFinalValue: ${error.message}`);
      throw error;
    }
  };

  // Limpar sessão
  const clearSession = () => {
    setFormData({
      personalInfo: {},
      digitalHabits: {},
      consumption: {},
      health: {},
      advanced: {}
    });
    setCalculationSession({
      sessionId: null,
      calculationId: null,
      isLoading: false,
      error: null
    });
    setCalculationResult(null);
    localStorage.removeItem('datapay_session');
  };

  // Verificar se todos os dados obrigatórios estão preenchidos
  const isFormComplete = () => {
    return (
      formData.personalInfo.age &&
      formData.personalInfo.gender &&
      formData.digitalHabits.socialNetworks?.length > 0 &&
      formData.consumption.shoppingChannels?.length > 0 &&
      formData.health.healthInterests?.length > 0 &&
      formData.advanced.incomeRange &&
      formData.advanced.professionalArea
    );
  };

  // Inicializar na primeira renderização
  useEffect(() => {
    const savedSession = restoreSession();
    if (!savedSession) {
      initializeSession().catch(error => {
        console.error('Erro ao inicializar sessão:', error);
      });
    }
  }, []);

  const exposedHook = {
    formData,
    updateFormData,
    calculationSession,
    calculationResult,
    loading: calculationSession.isLoading,
    error: calculationSession.error,
    initializeSession,
    calculateValue: calculateFinalValue,
    resetForm: clearSession,
    clearSession,
    isFormComplete
  };

  // Expor o hook globalmente para depuração
  window.useFormDataWithAPI = exposedHook;

  return exposedHook;
};
