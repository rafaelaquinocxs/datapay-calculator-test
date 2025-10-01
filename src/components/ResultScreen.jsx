import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { 
  DollarSign, 
  Users, 
  Shield, 
  TrendingUp,
  Share2,
  Vault,
  ArrowLeft
} from 'lucide-react';

const ResultScreen = ({ formData, calculationResult, onRestart, onBack }) => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Animação do valor
    setTimeout(() => setIsAnimating(false), 2000);
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Calculadora de Valor dos Dados - DataPay',
        text: `Descobri que meus dados valem R$ ${calculationResult?.total_value?.toFixed(2)}! Calcule o valor dos seus dados também.`,
        url: window.location.href,
      });
    } else {
      // Fallback para navegadores que não suportam Web Share API
      const text = `Descobri que meus dados valem R$ ${calculationResult?.total_value?.toFixed(2)}! Calcule o valor dos seus dados também: ${window.location.href}`;
      navigator.clipboard.writeText(text);
      alert('Link copiado para a área de transferência!');
    }
  };

  if (!calculationResult) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Calculando o valor dos seus dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header com valor principal */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <DollarSign className="w-12 h-12 text-white" />
        </div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold text-purple-600 mb-4"
        >
          R$ {isAnimating ? '0.00' : calculationResult.total_value?.toFixed(2) || '0.00'}
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-xl text-gray-600 mb-6"
        >
          É quanto seus dados valem no mercado
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 max-w-2xl mx-auto"
        >
          <p className="text-red-700 font-medium">
            😱 Hoje você entrega tudo isso de graça
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto"
        >
          <p className="text-blue-700">
            No <strong>DataPay</strong>, você guarda seus dados em um cofre digital e transforma em benefícios reais.
          </p>
        </motion.div>
      </motion.div>

      {/* Estatísticas */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
      >
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">100+</div>
          <div className="text-gray-600">Parceiros</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">R$ 50+</div>
          <div className="text-gray-600">Já resgatado</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
          <div className="text-gray-600">Seguro</div>
        </div>
      </motion.div>

      {/* Breakdown do cálculo */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        className="bg-white rounded-2xl shadow-lg p-8 mb-8"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Como chegamos neste valor:
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-700">Dados demográficos:</span>
            <span className="font-semibold text-gray-800">
              R$ {calculationResult.breakdown?.demographics?.toFixed(2) || '0.00'}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-700">Hábitos digitais:</span>
            <span className="font-semibold text-gray-800">
              R$ {calculationResult.breakdown?.digitalHabits?.toFixed(2) || '0.00'}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-700">Padrões de consumo:</span>
            <span className="font-semibold text-gray-800">
              R$ {calculationResult.breakdown?.consumption?.toFixed(2) || '0.00'}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-700">Interesses em saúde:</span>
            <span className="font-semibold text-gray-800">
              R$ {calculationResult.breakdown?.health?.toFixed(2) || '0.00'}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-700">Dados profissionais:</span>
            <span className="font-semibold text-gray-800">
              R$ {calculationResult.breakdown?.advanced?.toFixed(2) || '0.00'}
            </span>
          </div>
          <div className="flex justify-between items-center py-4 border-t-2 border-purple-200">
            <span className="text-lg font-bold text-gray-800">Total:</span>
            <span className="text-xl font-bold text-purple-600">
              R$ {calculationResult.total_value?.toFixed(2) || '0.00'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Insights */}
      {calculationResult.insights && calculationResult.insights.length > 0 && (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 mb-8"
        >
          <h3 className="text-xl font-bold text-yellow-800 mb-4 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2" />
            💡 Insights sobre seus dados:
          </h3>
          <ul className="space-y-3">
            {calculationResult.insights.map((insight, index) => (
              <li key={index} className="text-yellow-700 flex items-start">
                <span className="text-yellow-600 mr-2">•</span>
                {insight}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Call to Actions */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.7, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
      >
        <Button
          onClick={() => alert('Funcionalidade em desenvolvimento!')}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Vault className="w-6 h-6 mr-2" />
          Criar meu Cofre de Dados
        </Button>
        
        <Button
          onClick={handleShare}
          variant="outline"
          className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Share2 className="w-6 h-6 mr-2" />
          Compartilhar resultado
        </Button>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.9, duration: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Button
          onClick={onRestart}
          variant="outline"
          className="border-orange-500 text-orange-600 hover:bg-orange-50 py-3 px-6 rounded-xl"
        >
          Calcular novamente
        </Button>
        
        <Button
          onClick={onBack}
          variant="ghost"
          className="text-purple-600 hover:bg-purple-50 py-3 px-6 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao DataPay
        </Button>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.1, duration: 0.6 }}
        className="text-center mt-12 text-sm text-gray-500"
      >
        <p>🔒 Seus dados são processados de forma segura e anônima</p>
      </motion.div>
    </div>
  );
};

export default ResultScreen;
