import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Label } from '@/components/ui/label.jsx';
import { 
  DollarSign, 
  Code, 
  TrendingUp, 
  Heart, 
  GraduationCap, 
  Palette,
  HelpCircle
} from 'lucide-react';
import { INCOME_RANGES, PROFESSIONAL_AREAS } from '@/types';

const StepFive = ({ formData, updateFormData, onCalculate, onPrev, canProceed, loading }) => {
  const handleIncomeSelect = (income) => {
    updateFormData('advanced', { incomeRange: income });
  };

  const handleProfessionalAreaSelect = (area) => {
    updateFormData('advanced', { professionalArea: area });
  };

  const incomeOptions = INCOME_RANGES.map(range => ({
    ...range,
    icon: range.value === 'prefiro_nao_informar' ? HelpCircle : DollarSign
  }));

  const iconMap = {
    'tecnologia': Code,
    'negocios_vendas': TrendingUp,
    'saude': Heart,
    'educacao': GraduationCap,
    'criativo_design': Palette,
    'outro': HelpCircle
  };

  const professionalAreaOptions = PROFESSIONAL_AREAS.map(area => ({
    ...area,
    icon: iconMap[area.value] || HelpCircle
  }));

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="space-y-8">
        {/* Faixa de Renda */}
        <div className="space-y-4">
          <Label className="text-base font-medium text-gray-700">
            Faixa de Renda
          </Label>
          <div className="space-y-3">
            {incomeOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = formData?.advanced?.incomeRange === option.value;
              
              return (
                <motion.button
                  key={option.value}
                  onClick={() => handleIncomeSelect(option.value)}
                  className={`
                    w-full p-4 rounded-lg border-2 text-left transition-all duration-200 flex items-center space-x-4
                    ${isSelected
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className={`
                    p-3 rounded-full
                    ${isSelected ? 'bg-purple-100' : 'bg-gray-100'}
                  `}>
                    <Icon size={20} />
                  </div>
                  <span className="font-medium text-lg">{option.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Área Profissional */}
        <div className="space-y-4">
          <Label className="text-base font-medium text-gray-700">
            Área Profissional
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {professionalAreaOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = formData?.advanced?.professionalArea === option.value;
              
              return (
                <motion.button
                  key={option.value}
                  onClick={() => handleProfessionalAreaSelect(option.value)}
                  className={`
                    p-4 rounded-lg border-2 text-left transition-all duration-200 flex items-center space-x-3
                    ${isSelected
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`
                    p-2 rounded-full
                    ${isSelected ? 'bg-purple-100' : 'bg-gray-100'}
                  `}>
                    <Icon size={16} />
                  </div>
                  <span className="font-medium text-sm">{option.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Resumo das seleções */}
        {(formData?.advanced?.incomeRange || formData?.advanced?.professionalArea) && (
          <div className="bg-purple-50 p-4 rounded-lg space-y-2">
            <h4 className="font-medium text-purple-800 mb-2">Informações selecionadas:</h4>
            {formData?.advanced?.incomeRange && (
              <div className="flex items-center space-x-2">
                <span className="text-purple-600">💰</span>
                <span className="text-purple-700">
                  {incomeOptions.find(opt => opt.value === formData?.advanced?.incomeRange)?.label}
                </span>
              </div>
            )}
            {formData?.advanced?.professionalArea && (
              <div className="flex items-center space-x-2">
                <span className="text-purple-600">💼</span>
                <span className="text-purple-700">
                  {professionalAreaOptions.find(opt => opt.value === formData?.advanced?.professionalArea)?.label}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Mensagem de privacidade */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-700 text-sm">
            🔒 <strong>Privacidade:</strong> Todas as informações são tratadas de forma anônima e segura, seguindo as melhores práticas de proteção de dados.
          </p>
        </div>

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
            onClick={() => { alert('onCalculate chamado do StepFive!'); onCalculate(); }}
            disabled={!canProceed || loading}
            className={`
              px-8 py-3 transition-all duration-200
              ${canProceed && !loading
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {loading ? 'Calculando...' : 'Calcular Valor'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default StepFive;
