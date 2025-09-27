import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Heart, 
  Star, 
  MapPin, 
  Phone, 
  MessageCircle,
  ArrowLeft,
  Grid3X3,
  List,
  SlidersHorizontal,
  Bell,
  MessageSquare,
  User,
  LogOut
} from 'lucide-react';
import api from '../services/api';

export default function Marketplace() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

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

  const categories = [
    { id: 'all', name: 'Todos', icon: '🏗️' },
    { id: 'cement', name: 'Cimento', icon: '🧱' },
    { id: 'steel', name: 'Ferro e Aço', icon: '🔩' },
    { id: 'tools', name: 'Ferramentas', icon: '🔨' },
    { id: 'paint', name: 'Tintas', icon: '🎨' },
    { id: 'electrical', name: 'Elétrica', icon: '⚡' },
    { id: 'plumbing', name: 'Hidráulica', icon: '🚿' },
    { id: 'tiles', name: 'Revestimentos', icon: '🏠' }
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setProducts(response.data.data);
      } else {
        // Dados demo para fallback
        setProducts([
          {
            id: 1,
            name: 'Cimento Portland CP II-E-32',
            description: 'Cimento de alta qualidade para construção civil. Saco de 50kg.',
            price: 28.90,
            category: 'cement',
            stock: 150,
            images: [],
            seller: {
              id: 1,
              name: 'Construmais Materiais',
              rating: 4.8,
              location: 'São Paulo, SP',
              phone: '(11) 99999-9999'
            }
          },
          {
            id: 2,
            name: 'Furadeira de Impacto 650W',
            description: 'Furadeira profissional com mandril de 13mm. Ideal para alvenaria.',
            price: 189.90,
            category: 'tools',
            stock: 25,
            images: [],
            seller: {
              id: 2,
              name: 'Ferramentas Pro',
              rating: 4.9,
              location: 'Rio de Janeiro, RJ',
              phone: '(21) 88888-8888'
            }
          },
          {
            id: 3,
            name: 'Tinta Acrílica Branca 18L',
            description: 'Tinta acrílica premium para paredes internas e externas.',
            price: 89.90,
            category: 'paint',
            stock: 40,
            images: [],
            seller: {
              id: 3,
              name: 'Tintas & Cores',
              rating: 4.7,
              location: 'Belo Horizonte, MG',
              phone: '(31) 77777-7777'
            }
          },
          {
            id: 4,
            name: 'Vergalhão 10mm - Barra 12m',
            description: 'Vergalhão de aço CA-50 para estruturas de concreto armado.',
            price: 45.50,
            category: 'steel',
            stock: 80,
            images: [],
            seller: {
              id: 4,
              name: 'Aço & Ferro Ltda',
              rating: 4.6,
              location: 'Porto Alegre, RS',
              phone: '(51) 66666-6666'
            }
          },
          {
            id: 5,
            name: 'Porcelanato 60x60 Polido',
            description: 'Porcelanato retificado polido, cor bege. Caixa com 1,44m².',
            price: 65.90,
            category: 'tiles',
            stock: 120,
            images: [],
            seller: {
              id: 5,
              name: 'Revestimentos Premium',
              rating: 4.8,
              location: 'Curitiba, PR',
              phone: '(41) 55555-5555'
            }
          },
          {
            id: 6,
            name: 'Fio Elétrico 2,5mm 100m',
            description: 'Fio de cobre flexível para instalações elétricas residenciais.',
            price: 125.00,
            category: 'electrical',
            stock: 60,
            images: [],
            seller: {
              id: 6,
              name: 'Elétrica Total',
              rating: 4.9,
              location: 'Salvador, BA',
              phone: '(71) 44444-4444'
            }
          }
        ]);
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      // Usar dados demo em caso de erro
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSeller = (seller) => {
    navigate(`/messages?user=${seller.id}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const filteredProducts = React.useMemo(() => {
    if (!Array.isArray(products)) {
      return [];
    }
    
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesPrice = (!priceRange.min || product.price >= parseFloat(priceRange.min)) &&
                          (!priceRange.max || product.price <= parseFloat(priceRange.max));
      
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, searchTerm, selectedCategory, priceRange]);

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
              <span className="text-2xl font-bold text-white">Marketplace</span>
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

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': orcamentariaColors.primary }}
                />
              </div>
            </div>

            {/* View Mode and Filters */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'text-white' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  style={{ backgroundColor: viewMode === 'grid' ? orcamentariaColors.primary : 'transparent' }}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'text-white' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  style={{ backgroundColor: viewMode === 'list' ? orcamentariaColors.primary : 'transparent' }}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filtros</span>
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': orcamentariaColors.primary }}
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preço Mínimo</label>
                  <input
                    type="number"
                    placeholder="R$ 0,00"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': orcamentariaColors.primary }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preço Máximo</label>
                  <input
                    type="number"
                    placeholder="R$ 999,00"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': orcamentariaColors.primary }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Categories Quick Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'text-white'
                    : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                }`}
                style={{ 
                  backgroundColor: selectedCategory === category.id ? orcamentariaColors.primary : undefined 
                }}
              >
                <span>{category.icon}</span>
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid/List */}
        {loading ? (
          <div className="text-center py-12">
            <div 
              className="animate-spin rounded-full h-12 w-12 border-b-4 mx-auto mb-4"
              style={{ borderColor: orcamentariaColors.primary }}
            ></div>
            <p className="text-gray-600">Carregando produtos...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-600">Tente ajustar os filtros ou buscar por outros termos.</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className={`${viewMode === 'list' ? 'flex' : ''}`}>
                  {/* Product Image */}
                  <div className={`${viewMode === 'list' ? 'w-48 h-32' : 'h-48'} bg-gray-200 flex items-center justify-center`}>
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 text-center">
                        <ShoppingCart className="w-12 h-12 mx-auto mb-2" />
                        <span className="text-sm">Sem imagem</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className={`${viewMode === 'list' ? 'flex justify-between' : ''}`}>
                      <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                        
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-2xl font-bold" style={{ color: orcamentariaColors.primary }}>
                            {formatPrice(product.price)}
                          </div>
                          <div className="text-sm text-gray-600">
                            Estoque: {product.stock} unidades
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className={`${viewMode === 'list' ? 'ml-4 flex flex-col justify-between' : 'space-y-2'}`}>
                      <button
                        onClick={() => handleContactSeller(product.seller)}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-white rounded-lg transition-colors"
                        style={{ backgroundColor: orcamentariaColors.primary }}
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Contatar</span>
                      </button>
                      
                      <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <Heart className="w-4 h-4" />
                        <span>Favoritar</span>
                      </button>

                      {viewMode === 'list' && (
                        <div className="text-sm text-gray-600 mt-2">
                          <div className="font-medium">{product.seller.name}</div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span>{product.seller.rating}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {viewMode === 'grid' && (
                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <div className="font-medium text-gray-900">{product.seller.name}</div>
                          <div className="flex items-center space-x-1 text-gray-600">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span>{product.seller.rating}</span>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}