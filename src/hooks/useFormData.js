import { useState, useCallback } from 'react';
import { createInitialFormData } from '../types/index.js';

export const useFormData = () => {
  const [formData, setFormData] = useState(createInitialFormData());
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);

  // Atualizar dados de uma seção específica
  const updateFormData = useCallback((section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data
      }
    }));
  }, []);

  // Navegar para próxima etapa
  const nextStep = useCallback(() => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsComplete(true);
    }
  }, [currentStep]);

  // Navegar para etapa anterior
  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  // Ir para uma etapa específica
  const goToStep = useCallback((step) => {
    if (step >= 1 && step <= 5) {
      setCurrentStep(step);
      setIsComplete(false);
    }
  }, []);

  // Resetar formulário
  const resetForm = useCallback(() => {
    setFormData(createInitialFormData());
    setCurrentStep(1);
    setIsComplete(false);
  }, []);

  // Validar se uma etapa está completa
  const isStepValid = useCallback((step) => {
    switch (step) {
      case 1:
        return formData.personalInfo.age && 
               formData.personalInfo.gender && 
               formData.personalInfo.location;
      case 2:
        return formData.digitalHabits.socialNetworks.length > 0;
      case 3:
        return formData.consumption.shoppingChannels.length > 0 || 
               formData.consumption.favoriteCategories.length > 0;
      case 4:
        return true; // Saúde é opcional
      case 5:
        return formData.advanced.incomeRange && 
               formData.advanced.professionalArea;
      default:
        return false;
    }
  }, [formData]);

  // Verificar se pode avançar para próxima etapa
  const canProceed = useCallback(() => {
    return isStepValid(currentStep);
  }, [currentStep, isStepValid]);

  // Calcular progresso
  const getProgress = useCallback(() => {
    if (isComplete) return 100;
    return Math.round((currentStep / 5) * 100);
  }, [currentStep, isComplete]);

  // Obter título da etapa atual
  const getStepTitle = useCallback(() => {
    const titles = {
      1: 'Identificação Básica',
      2: 'Hábitos Digitais',
      3: 'Consumo e Estilo de Vida',
      4: 'Saúde e Bem-estar',
      5: 'Dados Avançados'
    };
    return titles[currentStep] || '';
  }, [currentStep]);

  // Obter subtítulo da etapa atual
  const getStepSubtitle = useCallback(() => {
    const subtitles = {
      1: 'Vamos conhecer você melhor',
      2: 'Que redes sociais você usa?',
      3: 'Como você gosta de comprar?',
      4: 'Conte sobre seus hábitos saudáveis',
      5: 'Últimas informações para calcular seu valor'
    };
    return subtitles[currentStep] || '';
  }, [currentStep]);

  return {
    formData,
    currentStep,
    isComplete,
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    resetForm,
    isStepValid,
    canProceed,
    getProgress,
    getStepTitle,
    getStepSubtitle
  };
};
