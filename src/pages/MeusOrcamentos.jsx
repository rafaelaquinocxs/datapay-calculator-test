import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Calculator, 
  ArrowLeft,
  Bell,
  MessageSquare,
  User,
  LogOut,
  Clock,
  FileText,
  Building,
  Wrench
} from 'lucide-react';

export default function MeusOrcamentos() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Cores da Orçamentaria
  const orcamentariaColors = {
    primary: '#A0453F',
    secondary: '#7A3530', 
    accent: '#C85A54',
    light: '#D4726C',
    dark: '#5D2520',
    gray: '#6B7280',
    lightGray: '#F9FAFB',
    white: '#FFFFFF'
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: orcamentariaColors.lightGray }}>
      {/* Header */}
      <header className="sticky top-0 z-50 shadow-md" style={{ backgroundColor: orcamentariaColors.primary }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/')}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg cursor-pointer"
                style={{ backgroundColor: orcamentariaColors.white, color: orcamentariaColors.primary }}
                onClick={() => navigate('/')}
              >
                O
              </div>
              <span className="text-2xl font-bold text-white">Meus Orçamentos</span>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/notifications')}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              >
                <Bell className="w-6 h-6" />
              </button>
              
              <button 
                onClick={() => navigate('/messages')}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              >
                <MessageSquare className="w-6 h-6" />
              </button>
              
              <button 
                onClick={() => navigate('/profile')}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              >
                <User className="w-6 h-6" />
              </button>
              
              <button 
                onClick={logout} 
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Conteúdo Principal */}
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          {/* Ícone Principal */}
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
            style={{ backgroundColor: orcamentariaColors.light }}
          >
            <Calculator className="w-12 h-12 text-white" />
          </div>

          {/* Título */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Meus Orçamentos
          </h1>

          {/* Mensagem Principal */}
          <div 
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-full text-lg font-semibold text-white mb-8"
            style={{ backgroundColor: orcamentariaColors.primary }}
          >
            <Clock className="w-6 h-6" />
            <span>Em breve aqui seus orçamentos da Orçamentaria</span>
          </div>

          {/* Descrição */}
          <p className="text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
            Estamos desenvolvendo uma ferramenta completa para você gerenciar todos os seus orçamentos 
            de construção e reforma em um só lugar. Em breve você poderá criar, editar e acompanhar 
            seus orçamentos diretamente na plataforma.
          </p>

          {/* Recursos que virão */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 border border-gray-200 rounded-lg">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: orcamentariaColors.accent }}
              >
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Criação de Orçamentos</h3>
              <p className="text-sm text-gray-600">
                Crie orçamentos detalhados com materiais, mão de obra e custos
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: orcamentariaColors.secondary }}
              >
                <Building className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Gestão de Projetos</h3>
              <p className="text-sm text-gray-600">
                Organize seus projetos e acompanhe o progresso de cada obra
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: orcamentariaColors.dark }}
              >
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Ferramentas Avançadas</h3>
              <p className="text-sm text-gray-600">
                Calculadoras, tabelas de preços e relatórios personalizados
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="space-y-4">
            <p className="text-gray-700 font-medium">
              Enquanto isso, explore outras funcionalidades da plataforma:
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/marketplace')}
                className="px-6 py-3 text-white rounded-lg font-medium transition-colors hover:opacity-90"
                style={{ backgroundColor: orcamentariaColors.primary }}
              >
                Explorar Marketplace
              </button>
              
              <button
                onClick={() => navigate('/meus-pontos')}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Ver Meus Pontos
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Voltar ao Feed
              </button>
            </div>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Fique por dentro das novidades
            </h2>
            <p className="text-gray-600 mb-6">
              Acompanhe nossas redes sociais e seja o primeiro a saber quando a funcionalidade 
              de orçamentos estiver disponível.
            </p>
            
            <div className="flex justify-center space-x-4">
              <div className="text-center">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2"
                  style={{ backgroundColor: orcamentariaColors.light }}
                >
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm text-gray-600">Notificações ativadas</p>
              </div>
              
              <div className="text-center">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2"
                  style={{ backgroundColor: orcamentariaColors.accent }}
                >
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm text-gray-600">Suporte disponível</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}