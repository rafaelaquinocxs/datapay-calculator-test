import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { 
  DollarSign, 
  Shield, 
  TrendingUp, 
  Users,
  ArrowRight,
  Eye,
  Lock,
  Coins
} from 'lucide-react';

const LandingPage = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-3"
            >
              <DollarSign size={32} className="text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-800">DataPay</h1>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Calculadora de Valor dos Dados
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubra quanto seus dados valem
            </p>
          </motion.div>
        </motion.div>

        {/* Hero Section */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 150 }}
              className="w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Eye size={48} className="text-white" />
            </motion.div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Descubra quanto valem seus dados no mercado
            </h3>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Hoje, você entrega seus dados de graça. Aqui, mostramos o valor real que eles podem gerar.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={onStart}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Começar
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </motion.div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-white rounded-lg p-6 shadow-lg text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield size={24} className="text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">100% Seguro</h4>
              <p className="text-gray-600 text-sm">
                Seus dados são processados de forma anônima e segura
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp size={24} className="text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Valor Real</h4>
              <p className="text-gray-600 text-sm">
                Cálculo baseado em dados reais do mercado
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={24} className="text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Milhares de Usuários</h4>
              <p className="text-gray-600 text-sm">
                Junte-se a quem já descobriu o valor dos seus dados
              </p>
            </div>
          </motion.div>

          {/* Value Proposition */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white text-center"
          >
            <div className="flex items-center justify-center mb-6">
              <Coins size={48} className="text-yellow-300 mr-4" />
              <h3 className="text-2xl md:text-3xl font-bold">
                Transforme seus dados em benefícios reais
              </h3>
            </div>
            
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              No DataPay, você guarda seus dados em um cofre digital e transforma em benefícios reais.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-yellow-300">100+</div>
                <div className="text-sm opacity-80">Parceiros</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-300">R$ 50+</div>
                <div className="text-sm opacity-80">Já resgatado</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-300">100%</div>
                <div className="text-sm opacity-80">Seguro</div>
              </div>
            </div>
          </motion.div>

          {/* CTA Final */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 mb-6">
              Pronto para descobrir quanto seus dados valem?
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={onStart}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-4 text-xl font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Começar Agora
                <ArrowRight className="ml-3" size={24} />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
