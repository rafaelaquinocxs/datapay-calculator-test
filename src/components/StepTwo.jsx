import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Slider } from '@/components/ui/slider.jsx';
import { Instagram, Facebook, Linkedin, Music, Twitter, Youtube } from 'lucide-react';
import { SOCIAL_NETWORKS } from '@/types/index.js';

const StepTwo = ({ formData, updateFormData, onNext, onPrev, canProceed }) => {
  const handleSocialNetworkToggle = (network) => {
    const currentNetworks = formData.digitalHabits.socialNetworks || [];
    const isSelected = currentNetworks.includes(network);
    
    let updatedNetworks;
    if (isSelected) {
      updatedNetworks = currentNetworks.filter(n => n !== network);
    } else {
      updatedNetworks = [...currentNetworks, network];
    }
    
    updateFormData('digitalHabits', { socialNetworks: updatedNetworks });
  };

  const handleFrequencyChange = (value) => {
    updateFormData('digitalHabits', { usageFrequency: value[0] });
  };

  const socialNetworkOptions = [
    { value: 'instagram', label: 'Instagram', icon: Instagram },
    { value: 'facebook', label: 'Facebook', icon: Facebook },
    { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { value: 'tiktok', label: 'TikTok', icon: Music },
    { value: 'twitter', label: 'Twitter/X', icon: Twitter },
    { value: 'youtube', label: 'YouTube', icon: Youtube }
  ];

  const getFrequencyLabel = (value) => {
    if (value <= 3) return 'Pouco';
    if (value <= 7) return 'Médio';
    return 'Muito';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="space-y-8">
        {/* Redes Sociais */}
        <div className="space-y-4">
          <Label className="text-base font-medium text-gray-700">
            Redes Sociais
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {socialNetworkOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = formData.digitalHabits.socialNetworks?.includes(option.value);
              
              return (
                <motion.button
                  key={option.value}
                  onClick={() => handleSocialNetworkToggle(option.value)}
                  className={`
                    p-4 rounded-lg border-2 text-left transition-all duration-200 flex items-center space-x-3
                    ${isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`
                    p-2 rounded-full
                    ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}
                  `}>
                    <Icon size={20} />
                  </div>
                  <span className="font-medium">{option.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Frequência de Uso */}
        <div className="space-y-4">
          <Label className="text-base font-medium text-gray-700">
            Frequência de Uso
          </Label>
          <div className="space-y-4">
            <div className="px-4">
              <Slider
                value={[formData.digitalHabits.usageFrequency || 5]}
                onValueChange={handleFrequencyChange}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-gray-500 px-4">
              <span>Pouco</span>
              <span className="font-medium text-blue-600">
                {getFrequencyLabel(formData.digitalHabits.usageFrequency || 5)}
              </span>
              <span>Muito</span>
            </div>
          </div>
        </div>

        {/* Seleções atuais */}
        {formData.digitalHabits.socialNetworks?.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Redes selecionadas:</h4>
            <div className="flex flex-wrap gap-2">
              {formData.digitalHabits.socialNetworks.map(network => {
                const option = socialNetworkOptions.find(opt => opt.value === network);
                return (
                  <span key={network} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {option?.label || network}
                  </span>
                );
              })}
            </div>
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

export default StepTwo;
