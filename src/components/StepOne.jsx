import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { GENDER_OPTIONS } from '@/types';

const StepOne = ({ formData, updateFormData, onNext, onPrev, canProceed }) => {
  const handleGenderSelect = (gender) => {
    updateFormData('personalInfo', { gender });
  };

  const handleInputChange = (field, value) => {
    updateFormData('personalInfo', { [field]: value });
  };

  const genderOptions = [
    { value: GENDER_OPTIONS.MASCULINO, label: 'Masculino' },
    { value: GENDER_OPTIONS.FEMININO, label: 'Feminino' },
    { value: GENDER_OPTIONS.OUTRO, label: 'Outro' },
    { value: GENDER_OPTIONS.PREFIRO_NAO_DIZER, label: 'Prefiro não dizer' }
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
        {/* Idade */}
        <div className="space-y-3">
          <Label htmlFor="age" className="text-base font-medium text-gray-700">
            Idade
          </Label>
          <Input
            id="age"
            type="number"
            placeholder="Sua idade"
            value={formData.personalInfo.age}
            onChange={(e) => handleInputChange('age', e.target.value)}
            className="text-lg py-3 px-4 border-2 border-gray-200 focus:border-blue-500 transition-colors"
            min="18"
            max="100"
          />
        </div>

        {/* Gênero */}
        <div className="space-y-4">
          <Label className="text-base font-medium text-gray-700">
            Gênero
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {genderOptions.map((option) => (
              <motion.button
                key={option.value}
                onClick={() => handleGenderSelect(option.value)}
                className={`
                  p-4 rounded-lg border-2 text-left transition-all duration-200
                  ${formData.personalInfo.gender === option.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="font-medium">{option.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Cidade/Estado */}
        <div className="space-y-3">
          <Label htmlFor="location" className="text-base font-medium text-gray-700">
            Cidade/Estado
          </Label>
          <Input
            id="location"
            type="text"
            placeholder="Ex: São Paulo, SP"
            value={formData.personalInfo.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="text-lg py-3 px-4 border-2 border-gray-200 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Botões de navegação */}
        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={onPrev}
            disabled={true}
            className="px-8 py-3"
          >
            Anterior
          </Button>
          
          <Button
            onClick={onNext}
            disabled={!canProceed}
            className={`
              px-8 py-3 transition-all duration-200
              ${canProceed 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            Próximo
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default StepOne;
