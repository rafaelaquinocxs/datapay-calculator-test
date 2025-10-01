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
      console.log("Attempting to initialize session...");
      console.log("API_BASE_URL:", apiService.baseURL); // Adicionar log da URL base da API

    try {
      setCalculationSession(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await apiService.startCalculation();
      console.log("Response from startCalculation:", response);

      if (response.success) {
        const newSessionData = {
          sessionId: response.session_id,
          calculationId: response.calculation_id,
          isLoading: false
        };
        setCalculationSession(prev => ({ ...prev, ...newSessionData }));
        console.log("Session initialized, calculationId set to:", response.calculation_id);
        
        // Salvar no localStorage para persistência
        localStorage.setItem(\'datapay_session\', JSON.stringify({
          sessionId: response.session_id,
          calculationId: response.calculation_id
        }));
        console.log("Session saved to localStorage:", localStorage.getItem(\'datapay_session\'));
        console.log("Current calculationSession state after initializeSession:", newSessionData);
        
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
    console.log("calculateFinalValue chamado!");
    console.log("calculationId:", calculationSession.calculationId);
    console.log("formData para cálculo:", formData);
    if (!calculationSession.calculationId) {
      throw new Error("Nenhuma sessão ativa");
    }

    try {
      setCalculationSession(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await apiService.calculateValue(calculationSession.calculationId);
      
      if (response.success) {
        setCalculationResult(response.result);
        setCalculationSession(prev => ({ ...prev, isLoading: false, currentStep: 6 }));
      } else {
        console.error("Erro na resposta da API:", response);
        setCalculationSession(prev => ({ ...prev, isLoading: false, error: response.error || "Erro ao calcular o valor dos dados." }));
      }
    } catch (error) {
      console.error("Erro ao chamar a API de cálculo:", error);
      setCalculationSession(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || "Erro de conexão com o servidor. Tente novamente."
      }));
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

  // Inicializar ou restaurar sessão na primeira renderização
  useEffect(() => {
    const setupSession = async () => {
      let currentSession = restoreSession();
      if (!currentSession || !currentSession.calculationId) {
        try {
          const newSession = await initializeSession();
          currentSession = newSession;
        } catch (error) {
          console.error("Erro ao inicializar sessão:", error);
        }
      }
      // Certificar que o estado calculationSession está atualizado após a inicialização/restauração
      // Certificar que o estado calculationSession está atualizado após a inicialização/restauração
      if (currentSession && currentSession.calculationId) {
        setCalculationSession(prev => ({
          ...prev,
          sessionId: currentSession.sessionId,
          calculationId: currentSession.calculationId,
          isLoading: false
        }));
      } else if (newSession && newSession.calculation_id) {
        setCalculationSession(prev => ({
          ...prev,
          sessionId: newSession.session_id,
          calculationId: newSession.calculation_id,
          isLoading: false
        }));
      }
    };
    setupSession();
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

  
  

  return exposedHook;
};
