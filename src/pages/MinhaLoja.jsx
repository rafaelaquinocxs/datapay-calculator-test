import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal, 
  Send, 
  Image as ImageIcon,
  Smile,
  Bell,
  Search,
  Home as HomeIcon,
  ShoppingBag,
  MessageSquare,
  User,
  Settings,
  Star,
  Calculator,
  Package,
  Store,
  HelpCircle,
  LogOut,
  Menu,
  X,
  MapPin,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Calendar,
  Eye,
  Clock,
  ArrowLeft
} from 'lucide-react';

const MinhaLoja = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Dados demo de vendas
  const vendasDemo = [
    {
      id: 1,
      produto: 'Cimento Portland CP-II',
      cliente: 'João Silva',
      quantidade: 10,
      valor: 259.00,
      data: '2024-01-15',
      status: 'entregue'
    },
    {
      id: 2,
      produto: 'Tijolo Cerâmico 6 Furos',
      cliente: 'Maria Santos',
      quantidade: 500,
      valor: 425.00,
      data: '2024-01-14',
      status: 'em_transito'
    },
    {
      id: 3,
      produto: 'Tinta Acrílica Premium',
      cliente: 'Pedro Costa',
      quantidade: 3,
      valor: 269.70,
      data: '2024-01-13',
      status: 'processando'
    }
  ];

  // Dados demo de estatísticas
  const stats = {
    vendas_mes: 15420.50,
    pedidos_mes: 45,
    produtos_vendidos: 1250,
    clientes_ativos: 28,
    avaliacao_media: 4.8,
    visualizacoes_loja: 2340
  };

  // Cores da Orçamentaria
  const orcamentariaColors = {
    primary: '#A0453F',
    secondary: '#8B4513',
    accent: '#D2691E',
    light: '#F5E6D3',
    dark: '#654321'
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'entregue':
        return 'bg-green-100 text-green-800';
      case 'em_transito':
        return 'bg-blue-100 text-blue-800';
      case 'processando':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'entregue':
        return 'Entregue';
      case 'em_transito':
        return 'Em Trânsito';
      case 'processando':
        return 'Processando';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header 
        className="shadow-sm sticky top-0 z-40"
        style={{ backgroundColor: orcamentariaColors.primary }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo e Menu Toggle */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                  style={{ backgroundColor: orcamentariaColors.secondary }}
                >
                  O
                </div>
                <h1 className="text-xl font-bold text-white">Orçamentaria</h1>
              </div>
            </div>

            {/* Navegação Central */}
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => navigate('/')}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              >
                <HomeIcon className="w-6 h-6" />
              </button>
              <button 
                onClick={() => navigate('/marketplace')}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              >
                <ShoppingBag className="w-6 h-6" />
              </button>
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
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/profile')}
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white border-2 border-white hover:bg-white hover:bg-opacity-20 transition-colors"
                style={{ backgroundColor: orcamentariaColors.secondary }}
              >
                {user?.name?.charAt(0) || 'U'}
              </button>
              <button 
                onClick={logout} 
                className="text-white hover:bg-white hover:bg-opacity-20 px-3 py-1 rounded-lg transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Esquerda */}
          <aside className={`${sidebarCollapsed ? 'w-16' : 'w-80'} transition-all duration-300 space-y-4`}>
            {/* Menu de Navegação */}
            <div className="bg-white rounded-xl shadow-sm">
              <nav className="p-4">
                <button 
                  onClick={() => navigate('/')}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors mb-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  {!sidebarCollapsed && <span>Voltar ao Feed</span>}
                </button>
                
                <button 
                  onClick={() => navigate('/profile')}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5" />
                  {!sidebarCollapsed && <span>Meu perfil</span>}
                </button>
                <button 
                  onClick={() => navigate('/messages')}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                  {!sidebarCollapsed && <span>Mensagens</span>}
                </button>
                <button 
                  onClick={() => navigate('/marketplace')}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {!sidebarCollapsed && <span>Marketplace</span>}
                </button>
                <button 
                  onClick={() => navigate('/notifications')}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {!sidebarCollapsed && <span>Notificações</span>}
                </button>
                <button 
                  onClick={() => navigate('/meus-pontos')}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Star className="w-5 h-5" />
                  {!sidebarCollapsed && <span>Meus Pontos</span>}
                </button>
                <button 
                  onClick={() => navigate('/meus-orcamentos')}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Calculator className="w-5 h-5" />
                  {!sidebarCollapsed && <span>Meus Orçamentos</span>}
                </button>

                {/* Menus exclusivos para fornecedores */}
                {(user?.role === 'COMPANY' || user?.role === 'SERVICE_PROVIDER') && (
                  <>
                    <button 
                      onClick={() => navigate('/meus-produtos')}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Package className="w-5 h-5" />
                      {!sidebarCollapsed && <span>Meus Produtos</span>}
                    </button>
                    <button 
                      className="w-full flex items-center space-x-3 px-4 py-3 text-white rounded-lg transition-colors"
                      style={{ backgroundColor: orcamentariaColors.primary }}
                    >
                      <Store className="w-5 h-5" />
                      {!sidebarCollapsed && <span>Minha Loja</span>}
                    </button>
                  </>
                )}
                
                {!sidebarCollapsed && (
                  <div className="border-t pt-4 mt-4">
                    <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      <Settings className="w-5 h-5" />
                      <span>Configurações</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      <HelpCircle className="w-5 h-5" />
                      <span>Ajuda</span>
                    </button>
                    <button 
                      onClick={logout}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sair</span>
                    </button>
                  </div>
                )}
              </nav>
            </div>
          </aside>

          {/* Conteúdo Principal */}
          <main className="flex-1 space-y-6">
            {/* Header da Página */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Minha Loja</h1>
                  <p className="text-gray-600">Acompanhe o desempenho da sua loja</p>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': orcamentariaColors.primary }}
                  >
                    <option value="7">Últimos 7 dias</option>
                    <option value="30">Últimos 30 dias</option>
                    <option value="90">Últimos 90 dias</option>
                    <option value="365">Último ano</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center">
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${orcamentariaColors.primary}20` }}
                  >
                    <DollarSign 
                      className="w-6 h-6"
                      style={{ color: orcamentariaColors.primary }}
                    />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Vendas do Mês</p>
                    <p className="text-2xl font-bold text-gray-900">
                      R$ {stats.vendas_mes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center">
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${orcamentariaColors.secondary}20` }}
                  >
                    <ShoppingCart 
                      className="w-6 h-6"
                      style={{ color: orcamentariaColors.secondary }}
                    />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Pedidos</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pedidos_mes}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center">
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${orcamentariaColors.accent}20` }}
                  >
                    <Package 
                      className="w-6 h-6"
                      style={{ color: orcamentariaColors.accent }}
                    />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Produtos Vendidos</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.produtos_vendidos}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Clientes Ativos</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.clientes_ativos}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Avaliação</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.avaliacao_media}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <Eye className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Visualizações</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.visualizacoes_loja}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Gráfico de Vendas */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Vendas por Período</h3>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Gráfico de vendas será implementado aqui</p>
                  <p className="text-sm text-gray-500">Mostrando dados dos últimos {selectedPeriod} dias</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pedidos Recentes */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Pedidos Recentes</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {vendasDemo.slice(0, 5).map((pedido) => (
                    <div key={pedido.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900">
                              {pedido.produto}
                            </h4>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(pedido.status)}`}>
                              {getStatusText(pedido.status)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Cliente: {pedido.cliente}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-500">
                              Qtd: {pedido.quantidade}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              R$ {pedido.valor.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(pedido.data).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-200">
                  <button 
                    className="w-full text-center text-sm font-medium transition-colors"
                    style={{ color: orcamentariaColors.primary }}
                  >
                    Ver todos os pedidos
                  </button>
                </div>
              </div>

              {/* Produtos Mais Vendidos */}
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Produtos Mais Vendidos</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {[
                    { nome: 'Cimento Portland CP-II', vendas: 45, receita: 1165.50 },
                    { nome: 'Tijolo Cerâmico 6 Furos', vendas: 120, receita: 2550.00 },
                    { nome: 'Tinta Acrílica Premium', vendas: 18, receita: 1618.20 },
                    { nome: 'Areia Fina', vendas: 35, receita: 875.00 },
                    { nome: 'Brita 1', vendas: 28, receita: 980.00 }
                  ].map((produto, index) => (
                    <div key={index} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">
                            {produto.nome}
                          </h4>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-600">
                              {produto.vendas} vendas
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              R$ {produto.receita.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => navigate('/meus-produtos')}
                  className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left transition-colors"
                >
                  <Package 
                    className="w-6 h-6 mb-2"
                    style={{ color: orcamentariaColors.primary }}
                  />
                  <h4 className="font-medium text-gray-900">Gerenciar Produtos</h4>
                  <p className="text-sm text-gray-600">Cadastre e gerencie seus produtos</p>
                </button>
                
                <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left transition-colors">
                  <Clock 
                    className="w-6 h-6 mb-2"
                    style={{ color: orcamentariaColors.secondary }}
                  />
                  <h4 className="font-medium text-gray-900">Gerenciar Pedidos</h4>
                  <p className="text-sm text-gray-600">Atualize o status dos seus pedidos</p>
                </button>
                
                <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left transition-colors">
                  <Store 
                    className="w-6 h-6 mb-2"
                    style={{ color: orcamentariaColors.accent }}
                  />
                  <h4 className="font-medium text-gray-900">Configurar Loja</h4>
                  <p className="text-sm text-gray-600">Personalize as informações da sua loja</p>
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MinhaLoja;
