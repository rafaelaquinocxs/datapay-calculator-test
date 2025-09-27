import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Star, 
  Trophy, 
  Gift, 
  ArrowLeft,
  Bell,
  MessageSquare,
  User,
  LogOut,
  Award,
  Target,
  TrendingUp,
  Calendar,
  Zap
} from 'lucide-react';

export default function MeusPontos() {
  const { user: currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  // Estados inicializados corretamente - SEMPRE como valores seguros
  const [pontos, setPontos] = useState(0);
  const [historico, setHistorico] = useState([]);
  const [recompensas, setRecompensas] = useState([]);
  const [loading, setLoading] = useState(false); // Começar como false

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

  // Dados demo sempre disponíveis - FUNÇÃO PURA
  const getDemoPontos = () => ({
    total: 2450,
    nivel: 'Construtor Expert',
    proximoNivel: 'Mestre Construtor',
    pontosProximoNivel: 550,
    ranking: 15
  });

  const getDemoHistorico = () => [
    {
      id: 1,
      tipo: 'post_curtida',
      descricao: 'Post curtido por 10+ pessoas',
      pontos: 50,
      data: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      icone: 'heart'
    },
    {
      id: 2,
      tipo: 'produto_vendido',
      descricao: 'Produto vendido no marketplace',
      pontos: 100,
      data: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      icone: 'shopping'
    },
    {
      id: 3,
      tipo: 'perfil_completo',
      descricao: 'Perfil 100% preenchido',
      pontos: 200,
      data: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      icone: 'user'
    },
    {
      id: 4,
      tipo: 'primeiro_post',
      descricao: 'Primeiro post publicado',
      pontos: 150,
      data: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      icone: 'edit'
    },
    {
      id: 5,
      tipo: 'avaliacao_5_estrelas',
      descricao: 'Recebeu avaliação 5 estrelas',
      pontos: 300,
      data: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      icone: 'star'
    }
  ];

  const getDemoRecompensas = () => [
    {
      id: 1,
      nome: 'Desconto 10% Marketplace',
      descricao: 'Desconto de 10% em qualquer produto do marketplace',
      pontosNecessarios: 500,
      disponivel: true,
      icone: 'gift',
      categoria: 'desconto'
    },
    {
      id: 2,
      nome: 'Badge Construtor Expert',
      descricao: 'Badge especial no seu perfil',
      pontosNecessarios: 1000,
      disponivel: true,
      icone: 'award',
      categoria: 'badge'
    },
    {
      id: 3,
      nome: 'Destaque no Feed',
      descricao: 'Seu próximo post será destacado no feed',
      pontosNecessarios: 800,
      disponivel: true,
      icone: 'trending-up',
      categoria: 'destaque'
    },
    {
      id: 4,
      nome: 'Consultoria Gratuita',
      descricao: '1 hora de consultoria gratuita com especialista',
      pontosNecessarios: 2000,
      disponivel: true,
      icone: 'user',
      categoria: 'servico'
    },
    {
      id: 5,
      nome: 'Acesso VIP',
      descricao: 'Acesso antecipado a novos recursos',
      pontosNecessarios: 3000,
      disponivel: false,
      icone: 'zap',
      categoria: 'vip'
    }
  ];

  // Inicialização imediata dos dados demo
  useEffect(() => {
    try {
      // Carregar dados demo imediatamente
      const dadosPontos = getDemoPontos();
      setPontos(dadosPontos.total);
      
      const dadosHistorico = getDemoHistorico();
      setHistorico(dadosHistorico);
      
      const dadosRecompensas = getDemoRecompensas();
      setRecompensas(dadosRecompensas);
      
    } catch (error) {
      console.error('Erro na inicialização do MeusPontos:', error);
      // Mesmo com erro, garantir dados básicos
      setPontos(2450);
      setHistorico(getDemoHistorico());
      setRecompensas(getDemoRecompensas());
    }
  }, []);

  const resgatarRecompensa = async (recompensaId) => {
    try {
      const recompensa = recompensas.find(r => r.id === recompensaId);
      if (!recompensa || pontos < recompensa.pontosNecessarios) return;

      // Atualizar pontos imediatamente
      setPontos(prev => prev - recompensa.pontosNecessarios);
      
      // Adicionar ao histórico
      const novoHistorico = {
        id: Date.now(),
        tipo: 'recompensa_resgatada',
        descricao: `Resgatou: ${recompensa.nome}`,
        pontos: -recompensa.pontosNecessarios,
        data: new Date().toISOString(),
        icone: 'gift'
      };
      
      setHistorico(prev => [novoHistorico, ...prev]);
      
      alert(`Recompensa "${recompensa.nome}" resgatada com sucesso!`);
      
    } catch (error) {
      console.error('Erro ao resgatar recompensa:', error);
    }
  };

  const getIconeHistorico = (tipo, icone) => {
    const iconProps = { className: "w-5 h-5" };
    
    switch (icone || tipo) {
      case 'heart':
        return <Star {...iconProps} className="w-5 h-5 text-red-500" />;
      case 'shopping':
        return <Trophy {...iconProps} className="w-5 h-5 text-green-500" />;
      case 'user':
        return <User {...iconProps} className="w-5 h-5 text-blue-500" />;
      case 'edit':
        return <Target {...iconProps} className="w-5 h-5 text-purple-500" />;
      case 'star':
        return <Star {...iconProps} className="w-5 h-5 text-yellow-500" />;
      case 'gift':
        return <Gift {...iconProps} className="w-5 h-5 text-pink-500" />;
      default:
        return <Star {...iconProps} className="w-5 h-5 text-gray-500" />;
    }
  };

  const getIconeRecompensa = (icone) => {
    const iconProps = { className: "w-6 h-6" };
    
    switch (icone) {
      case 'gift':
        return <Gift {...iconProps} className="w-6 h-6 text-pink-500" />;
      case 'award':
        return <Award {...iconProps} className="w-6 h-6 text-yellow-500" />;
      case 'trending-up':
        return <TrendingUp {...iconProps} className="w-6 h-6 text-green-500" />;
      case 'user':
        return <User {...iconProps} className="w-6 h-6 text-blue-500" />;
      case 'zap':
        return <Zap {...iconProps} className="w-6 h-6 text-purple-500" />;
      default:
        return <Gift {...iconProps} className="w-6 h-6 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'agora';
      if (diffInMinutes < 60) return `${diffInMinutes}m`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
      return `${Math.floor(diffInMinutes / 1440)}d`;
    } catch (error) {
      return 'agora';
    }
  };

  // Dados seguros com proteção TOTAL
  const dadosPontos = getDemoPontos();
  const safeHistorico = useMemo(() => {
    if (!historico || !Array.isArray(historico)) {
      return getDemoHistorico();
    }
    return historico.filter(item => item && typeof item === 'object' && item.id);
  }, [historico]);

  const safeRecompensas = useMemo(() => {
    if (!recompensas || !Array.isArray(recompensas)) {
      return getDemoRecompensas();
    }
    return recompensas.filter(item => item && typeof item === 'object' && item.id);
  }, [recompensas]);

  const recompensasDisponiveis = safeRecompensas.filter(r => r.disponivel && pontos >= r.pontosNecessarios);
  const progressoProximoNivel = ((pontos % 1000) / 1000) * 100;

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
              <span className="text-2xl font-bold text-white">Meus Pontos</span>
              <div 
                className="px-3 py-1 text-sm font-bold text-white rounded-full"
                style={{ backgroundColor: orcamentariaColors.accent }}
              >
                {pontos.toLocaleString()} pts
              </div>
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

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Resumo dos Pontos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total de Pontos */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total de Pontos</h3>
                <p className="text-3xl font-bold mt-2" style={{ color: orcamentariaColors.primary }}>
                  {pontos.toLocaleString()}
                </p>
              </div>
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: orcamentariaColors.light }}
              >
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Nível Atual */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Nível Atual</h3>
                <p className="text-xl font-bold mt-2" style={{ color: orcamentariaColors.primary }}>
                  {dadosPontos.nivel}
                </p>
                <div className="mt-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progresso</span>
                    <span>{Math.round(progressoProximoNivel)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        backgroundColor: orcamentariaColors.primary,
                        width: `${progressoProximoNivel}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: orcamentariaColors.accent }}
              >
                <Trophy className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Ranking */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Ranking</h3>
                <p className="text-3xl font-bold mt-2" style={{ color: orcamentariaColors.primary }}>
                  #{dadosPontos.ranking}
                </p>
                <p className="text-sm text-gray-600 mt-1">na comunidade</p>
              </div>
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: orcamentariaColors.secondary }}
              >
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recompensas Disponíveis */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recompensas Disponíveis</h2>
              <span className="text-sm text-gray-600">
                {recompensasDisponiveis.length} disponíveis
              </span>
            </div>

            <div className="space-y-4">
              {safeRecompensas.map(recompensa => (
                <div 
                  key={recompensa.id} 
                  className={`border rounded-lg p-4 transition-all ${
                    pontos >= recompensa.pontosNecessarios && recompensa.disponivel
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getIconeRecompensa(recompensa.icone)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{recompensa.nome}</h3>
                        <p className="text-sm text-gray-600 mt-1">{recompensa.descricao}</p>
                        <div className="flex items-center mt-2">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="text-sm font-medium text-gray-700">
                            {recompensa.pontosNecessarios.toLocaleString()} pontos
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {recompensa.disponivel ? (
                      <button
                        onClick={() => resgatarRecompensa(recompensa.id)}
                        disabled={pontos < recompensa.pontosNecessarios}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          pontos >= recompensa.pontosNecessarios
                            ? 'text-white hover:opacity-90'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                        style={{ 
                          backgroundColor: pontos >= recompensa.pontosNecessarios 
                            ? orcamentariaColors.primary 
                            : undefined 
                        }}
                      >
                        {pontos >= recompensa.pontosNecessarios ? 'Resgatar' : 'Insuficiente'}
                      </button>
                    ) : (
                      <span className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg text-sm">
                        Em breve
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Histórico de Pontos */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Histórico de Pontos</h2>
              <span className="text-sm text-gray-600">
                {safeHistorico.length} atividades
              </span>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {safeHistorico.map(item => (
                <div key={item.id} className="flex items-start space-x-3 p-3 border border-gray-100 rounded-lg">
                  <div className="flex-shrink-0 mt-1">
                    {getIconeHistorico(item.tipo, item.icone)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{item.descricao}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(item.data)}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span 
                      className={`text-sm font-bold ${
                        item.pontos > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {item.pontos > 0 ? '+' : ''}{item.pontos}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Como Ganhar Pontos */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Como Ganhar Pontos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Posts Populares</h3>
              <p className="text-sm text-gray-600 mt-1">50 pts por 10+ curtidas</p>
            </div>
            
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <Trophy className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Vendas</h3>
              <p className="text-sm text-gray-600 mt-1">100 pts por produto vendido</p>
            </div>
            
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <User className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Perfil Completo</h3>
              <p className="text-sm text-gray-600 mt-1">200 pts por completar perfil</p>
            </div>
            
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <Calendar className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Atividade Diária</h3>
              <p className="text-sm text-gray-600 mt-1">25 pts por dia ativo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}