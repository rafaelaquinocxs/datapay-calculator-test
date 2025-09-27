import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  ImageIcon,
  Smile,
  Bell,
  Search,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  MapPin,
  Star,
  Calculator
} from 'lucide-react';
import api from '../services/api';

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false); // MUDANÇA: Começar sem loading
  const [newPost, setNewPost] = useState('');
  const [location, setLocation] = useState(''); // NOVO: Campo de localização
  const [submitting, setSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showComments, setShowComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const fileInputRef = useRef(null);

  // Cores da Orçamentaria baseadas na logo oficial
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

  // MUDANÇA: useEffect que não causa loop infinito
  useEffect(() => {
    // Carregar dados demo imediatamente
    loadDemoData();
    
    // Tentar API apenas UMA VEZ em background
    const timer = setTimeout(() => {
      loadPostsFromAPI();
    }, 1000);

    return () => clearTimeout(timer);
  }, []); // IMPORTANTE: Array vazio para executar apenas uma vez

  // Função para carregar dados demo imediatamente
  const loadDemoData = () => {
    setPosts([
      {
        id: 1,
        content: 'Acabei de finalizar um projeto incrível! Uma casa de 200m² com design moderno e sustentável. O cliente ficou muito satisfeito com o resultado. 🏠✨ #arquitetura #sustentabilidade #design',
        location: 'São Paulo, SP', // NOVO: Localização
        user: {
          id: 1,
          name: user?.name || 'Usuário Demo',
          role_label: user?.role_label || 'Arquiteto',
          avatar: null
        },
        likes_count: 15,
        comments_count: 3,
        shares_count: 2,
        created_at: new Date(Date.now() - 60000).toISOString(),
        is_liked: false,
        comments: [
          {
            id: 1,
            content: 'Parabéns! Ficou lindo o projeto!',
            user: { name: 'Maria Silva', role_label: 'Cliente' },
            created_at: new Date(Date.now() - 30000).toISOString()
          }
        ],
        reactions: { like: 12, love: 3, laugh: 0, angry: 0 },
        user_reaction: null,
        images: []
      },
      {
        id: 2,
        content: 'Novos produtos chegando na loja! Cimento Portland de alta qualidade com preços especiais para obras acima de 50 sacos. Aproveitem a promoção! 🚚📦',
        location: 'Santos, SP', // NOVO: Localização
        user: {
          id: 2,
          name: 'Materiais Santos',
          role_label: 'Lojista',
          avatar: null
        },
        likes_count: 8,
        comments_count: 1,
        shares_count: 5,
        created_at: new Date(Date.now() - 240000).toISOString(),
        is_liked: true,
        comments: [],
        reactions: { like: 6, love: 2, laugh: 0, angry: 0 },
        user_reaction: 'like',
        images: []
      },
      {
        id: 3,
        content: 'Dica profissional: Sempre verifiquem a qualidade do concreto antes da concretagem. Um teste simples pode evitar problemas futuros na estrutura. Segurança em primeiro lugar! ⚠️🔧',
        location: 'Rio de Janeiro, RJ', // NOVO: Localização
        user: {
          id: 3,
          name: 'João Engenheiro',
          role_label: 'Engenheiro Civil',
          avatar: null
        },
        likes_count: 25,
        comments_count: 7,
        shares_count: 12,
        created_at: new Date(Date.now() - 480000).toISOString(),
        is_liked: false,
        comments: [
          {
            id: 2,
            content: 'Excelente dica! Muito importante mesmo.',
            user: { name: 'Pedro Costa', role_label: 'Arquiteto' },
            created_at: new Date(Date.now() - 300000).toISOString()
          },
          {
            id: 3,
            content: 'Já passei por isso. Realmente é fundamental!',
            user: { name: 'Ana Construções', role_label: 'Construtora' },
            created_at: new Date(Date.now() - 180000).toISOString()
          }
        ],
        reactions: { like: 20, love: 5, laugh: 0, angry: 0 },
        user_reaction: null,
        images: []
      }
    ]);
    setLoading(false);
  };

  // MUDANÇA: Função que tenta API apenas uma vez
  const loadPostsFromAPI = async () => {
    try {
      const response = await api.get('/social-posts');
      if (response.data && response.data.data) {
        setPosts(response.data.data.map(post => ({
          ...post,
          comments: post.comments || [],
          reactions: post.reactions || { like: 0, love: 0, laugh: 0, angry: 0 },
          user_reaction: post.user_reaction || null
        })));
      }
    } catch (error) {
      console.log('API indisponível, usando dados demo');
      // Não fazer nada, manter dados demo
    }
  };

  const loadNotifications = () => {
    setNotifications([
      {
        id: 1,
        type: 'like',
        message: 'Maria Silva curtiu seu post',
        time: '2 min',
        read: false
      },
      {
        id: 2,
        type: 'comment',
        message: 'João comentou no seu projeto',
        time: '5 min',
        read: false
      },
      {
        id: 3,
        type: 'follow',
        message: 'Ana começou a seguir você',
        time: '1h',
        read: true
      }
    ]);
  };

  const createPost = async (e) => {
    e.preventDefault();
    if (!newPost.trim() && !selectedFile) return;

    try {
      setSubmitting(true);
      
      const localPost = {
        id: Date.now(),
        content: newPost,
        location: location, // NOVO: Incluir localização
        user: {
          id: user.id,
          name: user.name,
          role_label: user.role_label || user.role,
          avatar: null
        },
        likes_count: 0,
        comments_count: 0,
        shares_count: 0,
        created_at: new Date().toISOString(),
        is_liked: false,
        comments: [],
        reactions: { like: 0, love: 0, laugh: 0, angry: 0 },
        user_reaction: null,
        images: selectedFile ? [URL.createObjectURL(selectedFile)] : []
      };
      
      setPosts([localPost, ...posts]);
      setNewPost('');
      setLocation(''); // NOVO: Limpar localização
      setSelectedFile(null);

      // Tentar salvar na API sem bloquear
      try {
        const formData = new FormData();
        formData.append('content', newPost);
        if (location) formData.append('location', location); // NOVO: Enviar localização
        if (selectedFile) {
          formData.append('image', selectedFile);
        }
        await api.post('/social-posts', formData);
      } catch (apiError) {
        console.log('API indisponível, post salvo localmente');
      }
      
    } catch (error) {
      console.error('Erro ao criar post:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleLike = async (postId) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const isLiked = post.is_liked;
        return {
          ...post,
          is_liked: !isLiked,
          likes_count: isLiked ? post.likes_count - 1 : post.likes_count + 1
        };
      }
      return post;
    });
    setPosts(updatedPosts);

    try {
      const post = posts.find(p => p.id === postId);
      if (post.is_liked) {
        await api.delete(`/social-posts/${postId}/like`);
      } else {
        await api.post(`/social-posts/${postId}/like`);
      }
    } catch (error) {
      console.log('API indisponível para curtidas');
    }
  };

  const addComment = async (postId) => {
    const commentText = newComment[postId];
    if (!commentText?.trim()) return;

    const comment = {
      id: Date.now(),
      content: commentText,
      user: {
        name: user.name,
        role_label: user.role_label || user.role
      },
      created_at: new Date().toISOString()
    };

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...(post.comments || []), comment],
          comments_count: (post.comments_count || 0) + 1
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    setNewComment({ ...newComment, [postId]: '' });

    try {
      await api.post(`/social-posts/${postId}/comments`, {
        content: commentText
      });
    } catch (error) {
      console.log('API indisponível para comentários');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'agora';
    if (diffInMinutes < 60) return `${diffInMinutes}min`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const emojis = ['😊', '😂', '❤️', '👍', '🎉', '🔥', '💪', '🏠', '🔧', '⚡', '✨', '🚀'];

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: orcamentariaColors.primary }}></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo e Menu */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              
              <div 
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: orcamentariaColors.primary }}
                >
                  O
                </div>
                <span className="text-xl font-bold" style={{ color: orcamentariaColors.primary }}>
                  Orçamentaria
                </span>
              </div>
            </div>

            {/* Busca */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar na Orçamentaria..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': orcamentariaColors.primary }}
                />
              </div>
            </div>

            {/* Ações do usuário */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/marketplace')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-6 h-6 text-gray-600">🛒</div>
              </button>
              
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  loadNotifications();
                }}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Bell className="w-6 h-6 text-gray-600" />
                {unreadCount > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 w-5 h-5 text-xs text-white rounded-full flex items-center justify-center"
                    style={{ backgroundColor: orcamentariaColors.accent }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
              
              <button 
                onClick={() => navigate('/messages')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <MessageCircle className="w-6 h-6 text-gray-600" />
              </button>
              
              <button 
                onClick={() => navigate('/profile')}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium"
                  style={{ backgroundColor: orcamentariaColors.primary }}
                >
                  {user?.name?.charAt(0) || 'U'}
                </div>
              </button>
              
              <button 
                onClick={logout}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <LogOut className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Dropdown de Notificações */}
        {showNotifications && (
          <div className="absolute right-4 top-16 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Notificações</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <div key={notification.id} className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}>
                    <p className="text-sm text-gray-800">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <p>Nenhuma notificação</p>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-300`}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-24">
              <nav className="space-y-2">
                <button 
                  onClick={() => navigate('/profile')}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium"
                    style={{ backgroundColor: orcamentariaColors.primary }}
                  >
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  {!sidebarCollapsed && <span>Meu perfil</span>}
                </button>
                
                <button 
                  onClick={() => navigate('/messages')}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  {!sidebarCollapsed && (
                    <div className="flex items-center justify-between w-full">
                      <span>Mensagens</span>
                      <span 
                        className="px-2 py-1 text-xs text-white rounded-full"
                        style={{ backgroundColor: orcamentariaColors.accent }}
                      >
                        3
                      </span>
                    </div>
                  )}
                </button>
                
                <button 
                  onClick={() => navigate('/marketplace')}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-5 h-5 text-gray-600">🛒</div>
                  {!sidebarCollapsed && <span>Marketplace</span>}
                </button>
                
                <button 
                  onClick={() => navigate('/notifications')}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {!sidebarCollapsed && (
                    <div className="flex items-center justify-between w-full">
                      <span>Notificações</span>
                      {unreadCount > 0 && (
                        <span 
                          className="px-2 py-1 text-xs text-white rounded-full"
                          style={{ backgroundColor: orcamentariaColors.accent }}
                        >
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  )}
                </button>

                {/* NOVO: Meus Pontos */}
                <button 
                  onClick={() => navigate('/meus-pontos')}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Star className="w-5 h-5" />
                  {!sidebarCollapsed && <span>Meus Pontos</span>}
                </button>

                {/* NOVO: Meus Orçamentos */}
                <button 
                  onClick={() => navigate('/meus-orcamentos')}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Calculator className="w-5 h-5" />
                  {!sidebarCollapsed && <span>Meus Orçamentos</span>}
                </button>
                
                {!sidebarCollapsed && (
                  <>
                    <hr className="my-4" />
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
                      className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sair</span>
                    </button>
                  </>
                )}
              </nav>
            </div>
          </div>

          {/* Feed Principal */}
          <div className="flex-1 max-w-2xl">
            {/* Criar Post */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex space-x-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium"
                  style={{ backgroundColor: orcamentariaColors.primary }}
                >
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1">
                  <form onSubmit={createPost}>
                    <textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder={`No que você está trabalhando, ${user?.name?.split(' ')[0] || 'usuário'}?`}
                      className="w-full p-4 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:border-transparent"
                      style={{ '--tw-ring-color': orcamentariaColors.primary }}
                      rows="4"
                    />
                    
                    {/* NOVO: Campo de Localização */}
                    <div className="mt-3 relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Adicionar localização..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': orcamentariaColors.primary }}
                      />
                    </div>
                    
                    {selectedFile && (
                      <div className="mt-4 relative">
                        <img 
                          src={URL.createObjectURL(selectedFile)} 
                          alt="Preview" 
                          className="max-h-64 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setSelectedFile(null)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex space-x-4">
                        <button 
                          type="button" 
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <ImageIcon className="w-5 h-5" />
                          <span>Foto</span>
                        </button>
                        {/* REMOVIDO: Botão de Vídeo */}
                        {/* REMOVIDO: Botão de Documento */}
                        <button 
                          type="button" 
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Smile className="w-5 h-5" />
                          <span>Emoji</span>
                        </button>
                      </div>
                      
                      <button
                        type="submit"
                        disabled={(!newPost.trim() && !selectedFile) || submitting}
                        className="px-6 py-2 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        style={{ backgroundColor: orcamentariaColors.primary }}
                      >
                        {submitting ? 'Publicando...' : 'Publicar'}
                      </button>
                    </div>
                    
                    {showEmojiPicker && (
                      <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                        <div className="grid grid-cols-6 gap-2">
                          {emojis.map(emoji => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => {
                                setNewPost(newPost + emoji);
                                setShowEmojiPicker(false);
                              }}
                              className="text-2xl hover:bg-gray-200 p-2 rounded"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </form>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Posts */}
            <div className="space-y-6">
              {posts.map(post => (
                <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6">
                    {/* Header do post */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium"
                          style={{ backgroundColor: orcamentariaColors.primary }}
                        >
                          {post.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{post.user?.name}</h3>
                          <p className="text-sm text-gray-500">
                            {post.user?.role_label} • {formatDate(post.created_at)} • 🌍 Público
                            {/* NOVO: Exibir localização */}
                            {post.location && (
                              <>
                                {' • '}
                                <span className="inline-flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {post.location}
                                </span>
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 p-2">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <p className="mt-4 text-gray-800 leading-relaxed">{post.content}</p>
                    
                    {post.images && post.images.length > 0 && (
                      <div className="mt-4">
                        <img 
                          src={post.images[0]} 
                          alt="Post" 
                          className="w-full rounded-lg max-h-96 object-cover"
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Estatísticas do post */}
                  <div className="px-6 py-2 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>❤️ {post.reactions?.like || 0}</span>
                        <span>💬 {post.comments_count || 0} comentários</span>
                        <span>🔄 {post.shares_count || 0} compartilhamentos</span>
                      </div>
                      <span>{post.likes_count || 0} pessoas curtiram</span>
                    </div>
                  </div>
                  
                  {/* Ações do post */}
                  <div className="px-6 py-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          post.is_liked 
                            ? 'text-red-600 bg-red-50' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${post.is_liked ? 'fill-current' : ''}`} />
                        <span>Curtir</span>
                      </button>
                      
                      <button
                        onClick={() => setShowComments({
                          ...showComments,
                          [post.id]: !showComments[post.id]
                        })}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span>Comentar</span>
                      </button>
                      
                      <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Share2 className="w-5 h-5" />
                        <span>Compartilhar</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Seção de comentários */}
                  {showComments[post.id] && (
                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                      {/* Comentários existentes */}
                      {post.comments && post.comments.length > 0 && (
                        <div className="space-y-3 mb-4">
                          {post.comments.map(comment => (
                            <div key={comment.id} className="flex space-x-3">
                              <div 
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                                style={{ backgroundColor: orcamentariaColors.primary }}
                              >
                                {comment.user?.name?.charAt(0) || 'U'}
                              </div>
                              <div className="flex-1">
                                <div className="bg-white rounded-lg px-3 py-2">
                                  <p className="font-medium text-sm text-gray-900">{comment.user?.name}</p>
                                  <p className="text-gray-800">{comment.content}</p>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 ml-3">
                                  {formatDate(comment.created_at)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Adicionar comentário */}
                      <div className="flex space-x-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                          style={{ backgroundColor: orcamentariaColors.primary }}
                        >
                          {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 flex space-x-2">
                          <input
                            type="text"
                            value={newComment[post.id] || ''}
                            onChange={(e) => setNewComment({
                              ...newComment,
                              [post.id]: e.target.value
                            })}
                            placeholder="Escreva um comentário..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                            style={{ '--tw-ring-color': orcamentariaColors.primary }}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                addComment(post.id);
                              }
                            }}
                          />
                          <button
                            onClick={() => addComment(post.id)}
                            disabled={!newComment[post.id]?.trim()}
                            className="px-4 py-2 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            style={{ backgroundColor: orcamentariaColors.primary }}
                          >
                            Enviar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}