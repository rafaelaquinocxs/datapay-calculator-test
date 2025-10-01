import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Label } from '@/components/ui/label.jsx';
import { 
  Dumbbell, 
  Apple, 
  Pill, 
  Leaf, 
  Stethoscope, 
  Brain 
} from 'lucide-react';
import { HEALTH_INTERESTS } from '../types/index.js';

const StepFour = ({ formData, updateFormData, onNext, onPrev, canProceed }) => {
  const handleHealthInterestToggle = (interest) => {
    const currentInterests = formData.health.healthInterests || [];
    const isSelected = currentInterests.includes(interest);
    
    let updatedInterests;
    if (isSelected) {
      updatedInterests = currentInterests.filter(i => i !== interest);
    } else {
      updatedInterests = [...currentInterests, interest];
    }
    
    updateFormData('health', { healthInterests: updatedInterests });
  };

  const healthInterestOptions = [
    { value: 'academia_exercicios', label: 'Academia e exercícios', icon: Dumbbell },
    { value: 'alimentacao_saudavel', label: 'Alimentação saudável', icon: Apple },
    { value: 'suplementos', label: 'Suplementos', icon: Pill },
    { value: 'produtos_naturais', label: 'Produtos naturais', icon: Leaf },
    { value: 'medicina_alternativa', label: 'Medicina alternativa', icon: Stethoscope },
    { value: 'wellness_mindfulness', label: 'Wellness e mindfulness', icon: Brain }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="space-y-8">
        {/* Interesses em Saúde */}
        <div className="space-y-4">
          <Label className="text-base font-medium text-gray-700">
            Interesses em Saúde
          </Label>
          <p className="text-sm text-gray-500 mb-4">
            Selecione os temas de saúde e bem-estar que mais interessam você (opcional)
          </p>
          <div className="grid grid-cols-1 gap-3">
            {healthInterestOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = formData.health.healthInterests?.includes(option.value);
              
              return (
                <motion.button
                  key={option.value}
                  onClick={() => handleHealthInterestToggle(option.value)}
                  className={`
                    w-full p-4 rounded-lg border-2 text-left transition-all duration-200 flex items-center space-x-4
                    ${isSelected
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className={`
                    p-3 rounded-full
                    ${isSelected ? 'bg-green-100' : 'bg-gray-100'}
                  `}>
                    <Icon size={24} />
                  </div>
                  <span className="font-medium text-lg">{option.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Seleções atuais */}
        {formData.health.healthInterests?.length > 0 && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Interesses selecionados:</h4>
            <div className="flex flex-wrap gap-2">
              {formData.health.healthInterests.map(interest => {
                const option = healthInterestOptions.find(opt => opt.value === interest);
                return (
                  <span key={interest} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    {option?.label || interest}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Mensagem informativa */}
        {formData.health.healthInterests?.length === 0 && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-700 text-sm">
              💡 <strong>Dica:</strong> Seus interesses em saúde ajudam empresas do setor a oferecer produtos e serviços mais relevantes para você.
            </p>
          </div>
        )}

        {/* Botões de navegação */}
        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={onPrev}
            className="px-8 py-3"
          >
            Anterior
          </Button>
          
          <Button
            onClick={onNext}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200"
          >
            Próximo
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default StepFour;
