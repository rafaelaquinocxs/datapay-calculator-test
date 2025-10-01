import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Label } from '@/components/ui/label.jsx';
import { 
  Store, 
  Globe, 
  Package, 
  Share2, 
  Truck,
  Shirt,
  Laptop,
  UtensilsCrossed,
  Plane,
  Home,
  Sparkles,
  Dumbbell,
  BookOpen
} from 'lucide-react';
import { SHOPPING_CHANNELS, SHOPPING_CATEGORIES } from '../types/index.js';

const StepThree = ({ formData, updateFormData, onNext, onPrev, canProceed }) => {
  const handleChannelToggle = (channel) => {
    const currentChannels = formData.consumption.shoppingChannels || [];
    const isSelected = currentChannels.includes(channel);
    
    let updatedChannels;
    if (isSelected) {
      updatedChannels = currentChannels.filter(c => c !== channel);
    } else {
      updatedChannels = [...currentChannels, channel];
    }
    
    updateFormData('consumption', { shoppingChannels: updatedChannels });
  };

  const handleCategoryToggle = (category) => {
    const currentCategories = formData.consumption.favoriteCategories || [];
    const isSelected = currentCategories.includes(category);
    
    let updatedCategories;
    if (isSelected) {
      updatedCategories = currentCategories.filter(c => c !== category);
    } else {
      updatedCategories = [...currentCategories, category];
    }
    
    updateFormData('consumption', { favoriteCategories: updatedCategories });
  };

  const shoppingChannelOptions = [
    { value: 'lojas_fisicas', label: 'Lojas físicas', icon: Store },
    { value: 'ecommerce', label: 'E-commerce (sites próprios)', icon: Globe },
    { value: 'marketplaces', label: 'Marketplaces (Amazon, Mercado Livre)', icon: Package },
    { value: 'redes_sociais', label: 'Redes sociais', icon: Share2 },
    { value: 'apps_delivery', label: 'Apps de delivery', icon: Truck }
  ];

  const categoryOptions = [
    { value: 'moda_vestuario', label: 'Moda e Vestuário', icon: Shirt },
    { value: 'eletronicos', label: 'Eletrônicos', icon: Laptop },
    { value: 'alimentacao', label: 'Alimentação', icon: UtensilsCrossed },
    { value: 'viagens', label: 'Viagens', icon: Plane },
    { value: 'casa_decoracao', label: 'Casa e Decoração', icon: Home },
    { value: 'beleza_cuidados', label: 'Beleza e Cuidados', icon: Sparkles },
    { value: 'esportes', label: 'Esportes', icon: Dumbbell },
    { value: 'livros_educacao', label: 'Livros e Educação', icon: BookOpen }
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
        {/* Onde você compra */}
        <div className="space-y-4">
          <Label className="text-base font-medium text-gray-700">
            Onde você compra?
          </Label>
          <div className="space-y-3">
            {shoppingChannelOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = formData.consumption.shoppingChannels?.includes(option.value);
              
              return (
                <motion.button
                  key={option.value}
                  onClick={() => handleChannelToggle(option.value)}
                  className={`
                    w-full p-4 rounded-lg border-2 text-left transition-all duration-200 flex items-center space-x-3
                    ${isSelected
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
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

        {/* Categorias Favoritas */}
        <div className="space-y-4">
          <Label className="text-base font-medium text-gray-700">
            Categorias Favoritas
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {categoryOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = formData.consumption.favoriteCategories?.includes(option.value);
              
              return (
                <motion.button
                  key={option.value}
                  onClick={() => handleCategoryToggle(option.value)}
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
                    <Icon size={16} />
                  </div>
                  <span className="font-medium text-sm">{option.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Resumo das seleções */}
        {(formData.consumption.shoppingChannels?.length > 0 || formData.consumption.favoriteCategories?.length > 0) && (
          <div className="bg-blue-50 p-4 rounded-lg space-y-3">
            {formData.consumption.shoppingChannels?.length > 0 && (
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Canais de compra:</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.consumption.shoppingChannels.map(channel => {
                    const option = shoppingChannelOptions.find(opt => opt.value === channel);
                    return (
                      <span key={channel} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {option?.label || channel}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
            
            {formData.consumption.favoriteCategories?.length > 0 && (
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Categorias favoritas:</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.consumption.favoriteCategories.map(category => {
                    const option = categoryOptions.find(opt => opt.value === category);
                    return (
                      <span key={category} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {option?.label || category}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
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

export default StepThree;
