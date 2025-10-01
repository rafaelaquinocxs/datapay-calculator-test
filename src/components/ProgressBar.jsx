import React from 'react';
import { motion } from 'framer-motion';
import { User, Smartphone, ShoppingCart, Heart, Briefcase } from 'lucide-react';

const ProgressBar = ({ currentStep, progress }) => {
  const steps = [
    { id: 1, icon: User, label: 'Identificação' },
    { id: 2, icon: Smartphone, label: 'Hábitos Digitais' },
    { id: 3, icon: ShoppingCart, label: 'Consumo' },
    { id: 4, icon: Heart, label: 'Saúde e Bem-estar' },
    { id: 5, icon: Briefcase, label: 'Dados Avançados' }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      {/* Barra de progresso */}
      <div className="relative mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Passo {currentStep} de 5
          </span>
          <span className="text-sm font-medium text-blue-600">
            {progress}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Ícones das etapas */}
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const isAccessible = currentStep >= step.id;

          return (
            <div key={step.id} className="flex flex-col items-center">
              <motion.div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center mb-2
                  ${isCompleted 
                    ? 'bg-green-500 text-white' 
                    : isActive 
                      ? 'bg-blue-500 text-white' 
                      : isAccessible
                        ? 'bg-gray-300 text-gray-600'
                        : 'bg-gray-200 text-gray-400'
                  }
                `}
                whileHover={isAccessible ? { scale: 1.1 } : {}}
                whileTap={isAccessible ? { scale: 0.95 } : {}}
                animate={isActive ? { 
                  boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)" 
                } : {}}
              >
                <Icon size={20} />
              </motion.div>
              
              <span className={`
                text-xs text-center max-w-16 leading-tight
                ${isActive 
                  ? 'text-blue-600 font-medium' 
                  : isCompleted
                    ? 'text-green-600 font-medium'
                    : 'text-gray-500'
                }
              `}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
