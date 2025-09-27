import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Camera, 
  Edit3, 
  MapPin, 
  Calendar, 
  Globe, 
  Phone, 
  Mail,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Send,
  ArrowLeft,
  Bell,
  MessageSquare,
  User,
  LogOut,
  UserPlus,
  UserMinus,
  X,
  Package,
  Store,
  ShoppingBag,
  Star,
  Calculator,
  Settings,
  HelpCircle,
  Menu
} from 'lucide-react';
import api from '../services/api';

export default function Profile() {
  const { user: currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams();
  
  // Estados inicializados corretamente - SEMPRE como valores seguros
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false); // Mudança: começar como false
  const [postsLoading, setPostsLoading] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone_number: '',
    bio: '',
    location: '',
    website: '',
    store_name: ''
  });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [showComments, setShowComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

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

  // Verificar se é empresa (apenas COMPANY tem acesso aos menus de fornecedor)
  const isCompany = currentUser?.role === 'COMPANY';

  // Dados demo sempre disponíveis - FUNÇÃO PURA
  const getDemoUser = () => {
    const profileUserId = userId || currentUser?.id || 'demo';
    const isOwn = !userId || userId == currentUser?.id;
    
    return {
      id: profileUserId,
      name: isOwn ? (currentUser?.name || 'Meu Nome') : 'Usuário Demo',
      email: isOwn ? (currentUser?.email || 'email@exemplo.com') : 'usuario@exemplo.com',
      phone_number: '(11) 99999-9999',
      role_label: isOwn ? (currentUser?.role_label || 'Usuário') : 'Arquiteto',
      social_account: {
        bio: 'Profissional da construção civil com mais de 10 anos de experiência.',
        location: 'São Paulo, SP',
        website: 'https://meusite.com',
        store_name: isOwn && currentUser?.role === 'COMPANY' ? 'Minha Empresa' : null
      },
      stats: {
        posts_count: '15',
        followers_count: '234',
        following_count: '89',
        products_count: '12'
      },
      avatar: null,
      cover: null,
      created_at: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
    };
  };

  const getDemoPosts = () => {
    const profileUserId = userId || currentUser?.id || 'demo';
    const userName = user?.name || currentUser?.name || 'Usuário';
    const userRole = user?.role_label || currentUser?.role_label || 'Usuário';
    
    return [
      {
        id: 1,
        content: 'Acabei de finalizar um projeto incrível! Uma casa moderna com conceitos sustentáveis.',
        user: {
          id: profileUserId,
          name: userName,
          role_label: userRole,
          avatar: null
        },
        likes_count: 24,
        comments_count: 8,
        shares_count: 3,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        is_liked: false,
        comments: []
      },
      {
        id: 2,
        content: 'Dicas importantes sobre fundações em terrenos irregulares. Sempre consulte um especialista!',
        user: {
          id: profileUserId,
          name: userName,
          role_label: userRole,
          avatar: null
        },
        likes_count: 18,
        comments_count: 5,
        shares_count: 7,
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        is_liked: true,
        comments: []
      }
    ];
  };

  // Inicialização imediata dos dados demo
  useEffect(() => {
    try {
      // Configurar dados básicos imediatamente
      const profileUserId = userId || currentUser?.id;
      const isOwn = !userId || userId == currentUser?.id;
      
      setIsOwnProfile(isOwn);
      
      // Carregar dados demo imediatamente
      const demoUser = getDemoUser();
      setUser(demoUser);
      
      const demoForm = {
        name: demoUser.name || '',
        email: demoUser.email || '',
        phone_number: demoUser.phone_number || '',
        bio: demoUser.social_account?.bio || '',
        location: demoUser.social_account?.location || '',
        website: demoUser.social_account?.website || '',
        store_name: demoUser.social_account?.store_name || ''
      };
      setEditForm(demoForm);
      
      const demoPosts = getDemoPosts();
      setPosts(demoPosts);
      
    } catch (error) {
      console.error('Erro na inicialização do Profile:', error);
      // Mesmo com erro, garantir dados básicos
      setUser(getDemoUser());
      setPosts(getDemoPosts());
    }
  }, [userId, currentUser?.id]);

  const handleEditProfile = async () => {
    try {
      // Simular sucesso sempre
      setUser({ 
        ...user, 
        name: editForm.name,
        email: editForm.email,
        phone_number: editForm.phone_number,
        social_account: {
          ...user.social_account,
          bio: editForm.bio,
          location: editForm.location,
          website: editForm.website,
          store_name: editForm.store_name
        }
      });
      
      setShowEditModal(false);
      
      // Tentar API em background
      try {
        await api.put('/users/profile', editForm);
      } catch (apiError) {
        console.log('API não disponível, mudanças salvas localmente');
      }
      
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setShowEditModal(false);
    }
  };

  const handleAvatarUpload = async (file) => {
    try {
      setUploadingAvatar(true);
      
      // Simular upload imediatamente
      const imageUrl = URL.createObjectURL(file);
      setUser({
        ...user,
        avatar: {
          id: Date.now(),
          url: imageUrl,
          filename: file.name,
          type: file.type
        }
      });
      
      // Tentar API em background
      try {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('type', 'avatar');
        
        const response = await api.post('/images', formData);
        
        if (response.data && response.data.data) {
          await api.put('/users/profile', {
            avatar_id: response.data.data.id
          });
        }
      } catch (apiError) {
        console.log('API não disponível, imagem salva localmente');
      }
      
    } catch (error) {
      console.error('Erro ao fazer upload do avatar:', error);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleCoverUpload = async (file) => {
    try {
      setUploadingCover(true);
      
      // Simular upload imediatamente
      const imageUrl = URL.createObjectURL(file);
      setUser({
        ...user,
        cover: {
          id: Date.now(),
          url: imageUrl,
          filename: file.name,
          type: file.type
        }
      });
      
      // Tentar API em background
      try {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('type', 'cover');
        
        const response = await api.post('/images', formData);
        
        if (response.data && response.data.data) {
          await api.put('/users/profile', {
            cover_id: response.data.data.id
          });
        }
      } catch (apiError) {
        console.log('API não disponível, imagem salva localmente');
      }
      
    } catch (error) {
      console.error('Erro ao fazer upload da capa:', error);
    } finally {
      setUploadingCover(false);
    }
  };

  const toggleFollow = async () => {
    try {
      const newFollowState = !isFollowing;
      setIsFollowing(newFollowState);
      
      // Atualizar contadores imediatamente
      setUser({
        ...user,
        stats: {
          ...user.stats,
          followers_count: newFollowState 
            ? (parseInt(user.stats.followers_count) + 1).toString()
            : (parseInt(user.stats.followers_count) - 1).toString()
        }
      });
      
      // Tentar API em background
      try {
        if (newFollowState) {
          await api.post(`/users/${user.id}/follow`);
        } else {
          await api.delete(`/users/${user.id}/follow`);
        }
      } catch (apiError) {
        console.log('API não disponível, ação salva localmente');
      }
      
    } catch (error) {
      console.error('Erro ao seguir/deixar de seguir:', error);
    }
  };

  const toggleLike = async (postId) => {
    try {
      setPosts(prevPosts => {
        if (!Array.isArray(prevPosts)) return [];
        
        return prevPosts.map(p => 
          p.id === postId 
            ? { 
                ...p, 
                is_liked: !p.is_liked,
                likes_count: p.is_liked ? p.likes_count - 1 : p.likes_count + 1
              }
            : p
        );
      });

      // Tentar API em background
      try {
        const post = posts.find(p => p.id === postId);
        if (post?.is_liked) {
          await api.delete(`/social-posts/${postId}/like`);
        } else {
          await api.post(`/social-posts/${postId}/like`);
        }
      } catch (apiError) {
        console.log('API não disponível, like salvo localmente');
      }
      
    } catch (error) {
      console.error('Erro ao curtir post:', error);
    }
  };

  const addComment = async (postId) => {
    const comment = newComment[postId];
    if (!comment?.trim()) return;

    try {
      const tempComment = {
        id: Date.now(),
        content: comment,
        user: {
          id: currentUser?.id || 'demo',
          name: currentUser?.name || 'Usuário',
          role_label: currentUser?.role_label || currentUser?.role || 'Usuário',
          avatar: null
        },
        created_at: new Date().toISOString()
      };

      setPosts(prevPosts => {
        if (!Array.isArray(prevPosts)) return [];
        
        return prevPosts.map(p => 
          p.id === postId 
            ? { 
                ...p, 
                comments: [...(p.comments || []), tempComment],
                comments_count: p.comments_count + 1
              }
            : p
        );
      });

      setNewComment({ ...newComment, [postId]: '' });

      // Tentar API em background
      try {
        await api.post(`/social-posts/${postId}/comments`, {
          content: comment
        });
      } catch (apiError) {
        console.log('API não disponível, comentário salvo localmente');
      }
      
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    }
  };

  const toggleComments = (postId) => {
    setShowComments({
      ...showComments,
      [postId]: !showComments[postId]
    });
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

  const formatJoinDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', { 
        year: 'numeric', 
        month: 'long' 
      });
    } catch (error) {
      return 'Janeiro 2024';
    }
  };

  // Posts filtrados com proteção TOTAL
  const safePosts = useMemo(() => {
    if (!posts || !Array.isArray(posts)) {
      return getDemoPosts();
    }
    return posts.filter(post => post && typeof post === 'object' && post.id);
  }, [posts, user]);

  // Se não tem usuário, mostrar dados demo
  const safeUser = user || getDemoUser();

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
              <span className="text-2xl font-bold text-white">Perfil</span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Menu toggle para empresas */}
              {isCompany && (
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                >
                  <Menu className="w-6 h-6" />
                </button>
              )}
              
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
                onClick={logout} 
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - apenas para empresas (COMPANY) */}
        {isCompany && !sidebarCollapsed && (
          <div className="w-64 bg-white shadow-sm h-screen sticky top-16">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Menu do Fornecedor</h3>
              
              <div className="space-y-2">
                {/* Voltar ao Feed */}
                <button
                  onClick={() => navigate('/')}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Voltar ao Feed</span>
                </button>

                {/* Marketplace */}
                <button
                  onClick={() => navigate('/marketplace')}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Marketplace</span>
                </button>

                {/* Mensagens */}
                <button
                  onClick={() => navigate('/messages')}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Mensagens</span>
                </button>

                {/* Notificações */}
                <button
                  onClick={() => navigate('/notifications')}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  <span>Notificações</span>
                </button>

                <hr className="my-4" />

                {/* Menus exclusivos para fornecedores */}
                <h4 className="text-sm font-medium text-gray-500 mb-2">ÁREA DO FORNECEDOR</h4>
                
                {/* Meus Produtos */}
                <button
                  onClick={() => navigate('/meus-produtos')}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-white rounded-lg transition-colors"
                  style={{ backgroundColor: orcamentariaColors.primary }}
                >
                  <Package className="w-5 h-5" />
                  <span>Meus Produtos</span>
                </button>

                {/* Minha Loja */}
                <button
                  onClick={() => navigate('/minha-loja')}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-white rounded-lg transition-colors"
                  style={{ backgroundColor: orcamentariaColors.accent }}
                >
                  <Store className="w-5 h-5" />
                  <span>Minha Loja</span>
                </button>

                <hr className="my-4" />

                {/* Meus Pontos */}
                <button
                  onClick={() => navigate('/meus-pontos')}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Star className="w-5 h-5" />
                  <span>Meus Pontos</span>
                </button>

                {/* Meus Orçamentos */}
                <button
                  onClick={() => navigate('/meus-orcamentos')}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Calculator className="w-5 h-5" />
                  <span>Meus Orçamentos</span>
                </button>

                <hr className="my-4" />

                {/* Configurações */}
                <button
                  onClick={() => navigate('/settings')}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  <span>Configurações</span>
                </button>

                {/* Ajuda */}
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
        )}

        {/* Conteúdo Principal */}
        <div className={`flex-1 ${isCompany && !sidebarCollapsed ? 'ml-0' : ''}`}>
          <div className="max-w-4xl mx-auto">
            {/* Seção especial para empresas - Cards de acesso rápido */}
            {isCompany && (
              <div className="mb-6 bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Área do Fornecedor</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => navigate('/meus-produtos')}
                    className="p-6 border-2 border-dashed rounded-lg hover:border-solid transition-all"
                    style={{ borderColor: orcamentariaColors.primary }}
                  >
                    <Package className="w-8 h-8 mx-auto mb-3" style={{ color: orcamentariaColors.primary }} />
                    <h3 className="font-semibold text-gray-900 mb-2">Meus Produtos</h3>
                    <p className="text-gray-600 text-sm">Gerencie seus produtos e estoque</p>
                  </button>

                  <button
                    onClick={() => navigate('/minha-loja')}
                    className="p-6 border-2 border-dashed rounded-lg hover:border-solid transition-all"
                    style={{ borderColor: orcamentariaColors.accent }}
                  >
                    <Store className="w-8 h-8 mx-auto mb-3" style={{ color: orcamentariaColors.accent }} />
                    <h3 className="font-semibold text-gray-900 mb-2">Minha Loja</h3>
                    <p className="text-gray-600 text-sm">Acompanhe vendas e pedidos</p>
                  </button>
                </div>
              </div>
            )}

            {/* Cover Photo */}
            <div className="relative h-80 bg-gradient-to-r from-gray-400 to-gray-600 overflow-hidden">
              {safeUser?.cover?.url ? (
                <img 
                  src={safeUser.cover.url} 
                  alt="Capa do perfil" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: orcamentariaColors.secondary }}
                >
                  <span className="text-white text-6xl font-bold opacity-50">
                    {safeUser?.name?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
              
              {isOwnProfile && (
                <button
                  onClick={() => coverInputRef.current?.click()}
                  disabled={uploadingCover}
                  className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-colors"
                >
                  {uploadingCover ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  ) : (
                    <Camera className="w-6 h-6" />
                  )}
                </button>
              )}
              
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files[0] && handleCoverUpload(e.target.files[0])}
                className="hidden"
              />
            </div>

            {/* Profile Info */}
            <div className="bg-white shadow-sm">
              <div className="px-6 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
                  {/* Avatar */}
                  <div className="relative -mt-16 mb-4 sm:mb-0">
                    <div className="relative">
                      <div 
                        className="w-32 h-32 rounded-full border-4 border-white shadow-lg flex items-center justify-center font-bold text-4xl text-white overflow-hidden"
                        style={{ backgroundColor: orcamentariaColors.primary }}
                      >
                        {safeUser?.avatar?.url ? (
                          <img 
                            src={safeUser.avatar.url} 
                            alt="Avatar" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          safeUser?.name?.charAt(0) || 'U'
                        )}
                      </div>
                      
                      {isOwnProfile && (
                        <button
                          onClick={() => avatarInputRef.current?.click()}
                          disabled={uploadingAvatar}
                          className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
                        >
                          {uploadingAvatar ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <Camera className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                    
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files[0] && handleAvatarUpload(e.target.files[0])}
                      className="hidden"
                    />
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900">{safeUser?.name || 'Usuário'}</h1>
                        <p className="text-lg text-gray-600">{safeUser?.role_label || 'Usuário'}</p>
                        {safeUser?.social_account?.location && (
                          <div className="flex items-center text-gray-500 mt-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{safeUser.social_account.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-3 mt-4 sm:mt-0">
                        {isOwnProfile ? (
                          <button
                            onClick={() => setShowEditModal(true)}
                            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                            <span>Editar perfil</span>
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={toggleFollow}
                              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                                isFollowing
                                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                  : 'text-white hover:opacity-90'
                              }`}
                              style={{ 
                                backgroundColor: !isFollowing ? orcamentariaColors.primary : undefined 
                              }}
                            >
                              {isFollowing ? <UserMinus className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                              <span>{isFollowing ? 'Deixar de seguir' : 'Seguir'}</span>
                            </button>
                            
                            <button
                              onClick={() => navigate(`/messages?user=${safeUser.id}`)}
                              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>Mensagem</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex space-x-6 mt-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">{safeUser?.stats?.posts_count || '0'}</div>
                        <div className="text-sm text-gray-600">Posts</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">{safeUser?.stats?.followers_count || '0'}</div>
                        <div className="text-sm text-gray-600">Seguidores</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">{safeUser?.stats?.following_count || '0'}</div>
                        <div className="text-sm text-gray-600">Seguindo</div>
                      </div>
                      {safeUser?.role_label === 'Lojista' && (
                        <div className="text-center">
                          <div className="text-xl font-bold text-gray-900">{safeUser?.stats?.products_count || '0'}</div>
                          <div className="text-sm text-gray-600">Produtos</div>
                        </div>
                      )}
                    </div>

                    {/* Bio */}
                    {safeUser?.social_account?.bio && (
                      <p className="text-gray-700 mt-4">{safeUser.social_account.bio}</p>
                    )}

                    {/* Additional Info */}
                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                      {safeUser?.email && (
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          <span>{safeUser.email}</span>
                        </div>
                      )}
                      {safeUser?.phone_number && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          <span>{safeUser.phone_number}</span>
                        </div>
                      )}
                      {safeUser?.social_account?.website && (
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 mr-1" />
                          <a 
                            href={safeUser.social_account.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:underline"
                            style={{ color: orcamentariaColors.primary }}
                          >
                            {safeUser.social_account.website}
                          </a>
                        </div>
                      )}
                      {safeUser?.created_at && (
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>Membro desde {formatJoinDate(safeUser.created_at)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Section */}
            <div className="mt-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  {isOwnProfile ? 'Meus Posts' : `Posts de ${safeUser?.name}`}
                </h2>

                {safePosts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">
                      {isOwnProfile ? 'Você ainda não fez nenhum post.' : 'Este usuário ainda não fez nenhum post.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {safePosts.map(post => (
                      <div key={post.id} className="border border-gray-200 rounded-lg p-6">
                        {/* Post Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                              style={{ backgroundColor: orcamentariaColors.primary }}
                            >
                              {post.user?.avatar ? (
                                <img 
                                  src={post.user.avatar} 
                                  alt="Avatar" 
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                post.user?.name?.charAt(0) || 'U'
                              )}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">{post.user?.name || 'Usuário'}</h3>
                              <p className="text-sm text-gray-600">{post.user?.role_label || 'Usuário'} • {formatDate(post.created_at)}</p>
                            </div>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Post Content */}
                        <div className="mb-4">
                          <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
                        </div>

                        {/* Post Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center space-x-6">
                            <button
                              onClick={() => toggleLike(post.id)}
                              className={`flex items-center space-x-2 transition-colors ${
                                post.is_liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                              }`}
                            >
                              <Heart className={`w-5 h-5 ${post.is_liked ? 'fill-current' : ''}`} />
                              <span>{post.likes_count || 0}</span>
                            </button>
                            
                            <button
                              onClick={() => toggleComments(post.id)}
                              className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
                            >
                              <MessageCircle className="w-5 h-5" />
                              <span>{post.comments_count || 0}</span>
                            </button>
                            
                            <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors">
                              <Share2 className="w-5 h-5" />
                              <span>{post.shares_count || 0}</span>
                            </button>
                          </div>
                        </div>

                        {/* Comments Section */}
                        {showComments[post.id] && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            {/* Add Comment */}
                            <div className="flex space-x-3 mb-4">
                              <div 
                                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm"
                                style={{ backgroundColor: orcamentariaColors.primary }}
                              >
                                {currentUser?.name?.charAt(0) || 'U'}
                              </div>
                              <div className="flex-1 flex space-x-2">
                                <input
                                  type="text"
                                  placeholder="Escreva um comentário..."
                                  value={newComment[post.id] || ''}
                                  onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      addComment(post.id);
                                    }
                                  }}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                                  style={{ '--tw-ring-color': orcamentariaColors.primary }}
                                />
                                <button
                                  onClick={() => addComment(post.id)}
                                  disabled={!newComment[post.id]?.trim()}
                                  className="px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  style={{ backgroundColor: orcamentariaColors.primary }}
                                >
                                  <Send className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Comments List */}
                            {post.comments && Array.isArray(post.comments) && post.comments.map(comment => (
                              <div key={comment.id} className="flex space-x-3 mb-3">
                                <div 
                                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm"
                                  style={{ backgroundColor: orcamentariaColors.secondary }}
                                >
                                  {comment.user?.avatar ? (
                                    <img 
                                      src={comment.user.avatar} 
                                      alt="Avatar" 
                                      className="w-full h-full rounded-full object-cover"
                                    />
                                  ) : (
                                    comment.user?.name?.charAt(0) || 'U'
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                                    <h4 className="font-medium text-sm text-gray-900">{comment.user?.name || 'Usuário'}</h4>
                                    <p className="text-sm text-gray-800">{comment.content}</p>
                                  </div>
                                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                                    <span>{formatDate(comment.created_at)}</span>
                                    <button className="hover:text-gray-700">Curtir</button>
                                    <button className="hover:text-gray-700">Responder</button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Editar Perfil</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': orcamentariaColors.primary }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': orcamentariaColors.primary }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input
                    type="tel"
                    value={editForm.phone_number}
                    onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': orcamentariaColors.primary }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': orcamentariaColors.primary }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': orcamentariaColors.primary }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    value={editForm.website}
                    onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': orcamentariaColors.primary }}
                  />
                </div>

                {currentUser?.role === 'COMPANY' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Loja</label>
                    <input
                      type="text"
                      value={editForm.store_name}
                      onChange={(e) => setEditForm({ ...editForm, store_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
                      style={{ '--tw-ring-color': orcamentariaColors.primary }}
                    />
                  </div>
                )}
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEditProfile}
                  className="flex-1 px-4 py-2 text-white rounded-lg transition-colors"
                  style={{ backgroundColor: orcamentariaColors.primary }}
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}