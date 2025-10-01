import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import StepOne from './components/StepOne';
import StepTwo from './components/StepTwo';
import StepThree from './components/StepThree';
import StepFour from './components/StepFour';
import StepFive from './components/StepFive';
import ResultScreen from './components/ResultScreen';
import ProgressBar from './components/ProgressBar';
import { useFormDataWithAPI } from './hooks/useFormDataWithAPI';

const STEPS = {
  LANDING: 'landing',
  STEP_1: 'step1',
  STEP_2: 'step2', 
  STEP_3: 'step3',
  STEP_4: 'step4',
  STEP_5: 'step5',
  RESULT: 'result'
};

const STEP_TITLES = {
  [STEPS.STEP_1]: 'Identificação',
  [STEPS.STEP_2]: 'Hábitos Digitais',
  [STEPS.STEP_3]: 'Consumo',
  [STEPS.STEP_4]: 'Saúde e Bem-estar',
  [STEPS.STEP_5]: 'Dados Avançados'
};

function App() {
  const [currentStep, setCurrentStep] = useState(STEPS.LANDING);
  const { 
    formData, 
    calculationResult, 
    loading, 
    error, 
    updateFormData, 
    calculateValue,
    resetForm 
  } = useFormDataWithAPI();

  const handleStart = () => {
    setCurrentStep(STEPS.STEP_1);
  };

  const handleNext = () => {
    const stepOrder = [STEPS.STEP_1, STEPS.STEP_2, STEPS.STEP_3, STEPS.STEP_4, STEPS.STEP_5];
    const currentIndex = stepOrder.indexOf(currentStep);
    
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    } else {
      handleCalculate();
    }
  };

  const handlePrevious = () => {
    const stepOrder = [STEPS.STEP_1, STEPS.STEP_2, STEPS.STEP_3, STEPS.STEP_4, STEPS.STEP_5];
    const currentIndex = stepOrder.indexOf(currentStep);
    
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    } else {
      setCurrentStep(STEPS.LANDING);
    }
  };

    const handleCalculate = async () => {
    console.log("🎯 handleCalculate iniciado");
    console.log("📊 FormData atual:", formData);
    const sessionId = calculationResult?.id; // Usar calculationResult para obter o ID
    if (!sessionId) {
      console.error("❌ Nenhum sessionId encontrado");
      alert("Erro: ID da sessão de cálculo não encontrado. Por favor, tente novamente.");
      return;
    }
    try {
      console.log("⏳ Chamando calculateValue com sessionId:", sessionId);
      const result = await calculateValue(sessionId); // Passar sessionId para calculateValue
      console.log("✅ Resultado recebido:", result);
      setCurrentStep(STEPS.RESULT);
    } catch (error) {
      console.error("❌ Erro ao calcular:", error);
      alert(`Erro ao calcular: ${error.message}`);
    }
  };

  const handleRestart = () => {
    resetForm();
    setCurrentStep(STEPS.LANDING);
  };

  const getCurrentStepNumber = () => {
    const stepOrder = [STEPS.STEP_1, STEPS.STEP_2, STEPS.STEP_3, STEPS.STEP_4, STEPS.STEP_5];
    return stepOrder.indexOf(currentStep) + 1;
  };

  const getProgress = () => {
    if (currentStep === STEPS.LANDING) return 0;
    if (currentStep === STEPS.RESULT) return 100;
    return (getCurrentStepNumber() / 5) * 100;
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case STEPS.LANDING:
        return <LandingPage onStart={handleStart} />;
      
      case STEPS.STEP_1:
        return (
          <StepOne
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onPrev={handlePrevious}
            canProceed={formData?.personalInfo?.age && formData?.personalInfo?.gender && formData?.personalInfo?.location}
          />
        );
      
      case STEPS.STEP_2:
        return (
          <StepTwo
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onPrev={handlePrevious}
            canProceed={formData?.digitalHabits?.socialNetworks?.length > 0 && formData?.digitalHabits?.usageFrequency}
          />
        );
      
      case STEPS.STEP_3:
        return (
          <StepThree
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onPrev={handlePrevious}
            canProceed={formData?.consumption?.shoppingChannels?.length > 0 && formData?.consumption?.favoriteCategories?.length > 0}
          />
        );
      
      case STEPS.STEP_4:
        return (
          <StepFour
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onPrev={handlePrevious}
            canProceed={formData?.health?.healthInterests?.length > 0}
          />
        );
      
      case STEPS.STEP_5:
        return (
          <StepFive
            formData={formData}
            updateFormData={updateFormData}
            onCalculate={handleCalculate}
            onPrev={handlePrevious}
            loading={loading}
            canProceed={formData?.advanced?.incomeRange && formData?.advanced?.professionalArea}
          />
        );
      
      case STEPS.RESULT:
        return (
          <ResultScreen
            result={calculationResult}
            onRestart={handleRestart}
            onBackToDataPay={() => setCurrentStep(STEPS.LANDING)}
          />
        );
      
      default:
        return <LandingPage onStart={handleStart} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header com Progress Bar */}
      {currentStep !== STEPS.LANDING && currentStep !== STEPS.RESULT && (
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Calculadora de Valor dos Dados
              </h1>
              <p className="text-sm text-gray-600">
                Descubra quanto seus dados valem
              </p>
            </div>
            
            <ProgressBar 
              currentStep={getCurrentStepNumber()}
              totalSteps={5}
              progress={getProgress()}
              stepTitles={STEP_TITLES}
              currentStepKey={currentStep}
            />
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mx-4 mt-4">
          <p className="font-medium">Erro:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-4">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">
            🔒 Seus dados são processados de forma segura e anônima
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
