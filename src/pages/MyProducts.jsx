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
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  ArrowLeft
} from 'lucide-react';

const MyProducts = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Cores da Orçamentaria
  const orcamentariaColors = {
    primary: '#A0453F',
    secondary: '#7A3530', 
    accent: '#C85A54',
    light: '#D4726C',
    dark: '#5D2520'
  };

  // Dados demo de produtos (removendo chamadas da API)
  const produtosDemo = [
    {
      id: 1,
      nome: 'Cimento Portland CP-II',
      categoria: 'Materiais de Construção',
      preco: 25.90,
      estoque: 150,
      descricao: 'Cimento Portland de alta qualidade para construção civil',
      imagem: '/api/placeholder/300/200',
      status: 'ativo',
      vendas: 45,
      visualizacoes: 234
    },
    {
      id: 2,
      nome: 'Tijolo Cerâmico 6 Furos',
      categoria: 'Materiais de Construção',
      preco: 0.85,
      estoque: 5000,
      descricao: 'Tijolo cerâmico de 6 furos para alvenaria',
      imagem: '/api/placeholder/300/200',
      status: 'ativo',
      vendas: 120,
      visualizacoes: 456
    },
    {
      id: 3,
      nome: 'Tinta Acrílica Premium',
      categoria: 'Tintas e Vernizes',
      preco: 89.90,
      estoque: 25,
      descricao: 'Tinta acrílica premium para paredes internas e externas',
      imagem: '/api/placeholder/300/200',
      status: 'pausado',
      vendas: 78,
      visualizacoes: 321
    }
  ];

  useEffect(() => {
    // Usar dados demo em vez de API
    setProdutos(produtosDemo);
  }, []);

  const filteredProducts = produtos.filter(produto => {
    const matchesSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         produto.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || produto.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(produtos.map(p => p.categoria))];

  const toggleProductStatus = (id) => {
    setProdutos(produtos.map(produto => 
      produto.id === id 
        ? { ...produto, status: produto.status === 'ativo' ? 'pausado' : 'ativo' }
        : produto
    ));
  };

  const deleteProduct = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      setProdutos(produtos.filter(produto => produto.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 shadow-md" style={{ backgroundColor: orcamentariaColors.primary }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: orcamentariaColors.accent }}
                >
                  O
                </div>
                <span className="text-white text-xl font-bold">Orçamentaria</span>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => navigate('/')}
                className="text-white hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <HomeIcon className="w-5 h-5" />
                <span>Home</span>
              </button>
              <button 
                onClick={() => navigate('/marketplace')}
                className="text-white hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Marketplace</span>
              </button>
              <button 
                onClick={() => navigate('/notifications')}
                className="text-white hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
              </button>
              <button 
                onClick={() => navigate('/messages')}
                className="text-white hover:bg-white hover:bg-opacity-20 px-3 py-2 rounded-lg transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            </nav>

            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer"
                style={{ backgroundColor: orcamentariaColors.accent }}
                onClick={() => navigate('/profile')}
              >
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <button
                onClick={logout}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {!sidebarCollapsed && (
          <div className="w-64 bg-white shadow-lg h-screen sticky top-16 overflow-y-auto">
            <div className="p-4">
              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors mb-4"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Voltar ao Feed</span>
              </button>

              <div className="space-y-2">
                <button
                  onClick={() => navigate('/profile')}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>Meu perfil</span>
                </button>

                <button
                  onClick={() => navigate('/messages')}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Mensagens</span>
                </button>

                <button
                  onClick={() => navigate('/marketplace')}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Marketplace</span>
                </button>

                <button
                  onClick={() => navigate('/notifications')}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  <span>Notificações</span>
                </button>

                <button
                  onClick={() => navigate('/meus-pontos')}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Star className="w-5 h-5" />
                  <span>Meus Pontos</span>
                </button>

                <button
                  onClick={() => navigate('/meus-orcamentos')}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Calculator className="w-5 h-5" />
                  <span>Meus Orçamentos</span>
                </button>

                {/* Seção do Fornecedor */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">
                    Menu do Fornecedor
                  </p>
                  
                  <button
                    onClick={() => navigate('/meus-produtos')}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-white rounded-lg transition-colors mb-2"
                    style={{ backgroundColor: orcamentariaColors.primary }}
                  >
                    <Package className="w-5 h-5" />
                    <span>Meus Produtos</span>
                  </button>

                  <button
                    onClick={() => navigate('/minha-loja')}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-white rounded-lg transition-colors"
                    style={{ backgroundColor: orcamentariaColors.accent }}
                  >
                    <Store className="w-5 h-5" />
                    <span>Minha Loja</span>
                  </button>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => navigate('/settings')}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                    <span>Configurações</span>
                  </button>

                  <button
                    onClick={() => navigate('/help')}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <HelpCircle className="w-5 h-5" />
                    <span>Ajuda</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Header da página */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Meus Produtos</h1>
              <p className="text-gray-600">Gerencie seus produtos e estoque</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors"
              style={{ backgroundColor: orcamentariaColors.primary }}
            >
              <Plus className="w-5 h-5" />
              <span>Adicionar Produto</span>
            </button>
          </div>

          {/* Cards de estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Produtos</p>
                  <p className="text-2xl font-bold text-gray-900">{produtos.length}</p>
                </div>
                <Package className="w-8 h-8" style={{ color: orcamentariaColors.primary }} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Produtos Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {produtos.filter(p => p.status === 'ativo').length}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Vendas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {produtos.reduce((acc, p) => acc + p.vendas, 0)}
                  </p>
                </div>
                <ShoppingBag className="w-8 h-8" style={{ color: orcamentariaColors.accent }} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Visualizações</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {produtos.reduce((acc, p) => acc + p.visualizacoes, 0)}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="md:w-48">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todas as categorias</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tabela de produtos */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estoque
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((produto) => (
                    <tr key={produto.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{produto.nome}</div>
                            <div className="text-sm text-gray-500">{produto.descricao.substring(0, 50)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {produto.categoria}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        R$ {produto.preco.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {produto.estoque}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleProductStatus(produto.id)}
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            produto.status === 'ativo'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {produto.status === 'ativo' ? 'Ativo' : 'Pausado'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {produto.vendas} vendas
                        <div className="text-xs text-gray-500">{produto.visualizacoes} visualizações</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingProduct(produto)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProduct(produto.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || selectedCategory 
                    ? 'Tente ajustar os filtros de busca'
                    : 'Comece adicionando seu primeiro produto'
                  }
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors"
                  style={{ backgroundColor: orcamentariaColors.primary }}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Adicionar Produto
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de adicionar/editar produto */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {editingProduct ? 'Editar Produto' : 'Adicionar Produto'}
            </h3>
            <p className="text-gray-600 mb-6">
              Funcionalidade em desenvolvimento. Em breve você poderá adicionar e editar produtos diretamente por aqui.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingProduct(null);
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Fechar
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-white rounded-lg hover:opacity-90"
                style={{ backgroundColor: orcamentariaColors.primary }}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProducts;
