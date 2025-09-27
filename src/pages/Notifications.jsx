import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Heart, 
  MessageCircle, 
  UserPlus, 
  ShoppingCart,
  Star,
  ArrowLeft,
  MessageSquare,
  User,
  LogOut,
  Check,
  CheckCheck,
  X,
  Filter
} from 'lucide-react';
import api from '../services/api';

export default function Notifications() {
  const { user: currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  // Estados inicializados corretamente - SEMPRE como valores seguros
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false); // Começar como false
  const [filter, setFilter] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);

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
  const getDemoNotifications = () => [
    {
      id: 1,
      type: 'like',
      title: 'Nova curtida',
      message: 'João Silva curtiu seu post sobre "Fundações em terrenos irregulares"',
      user: {
        id: 2,
        name: 'João Silva',
        role_label: 'Engenheiro',
        avatar: null
      },
      is_read: false,
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min atrás
      action_url: '/profile',
      icon: 'heart'
    },
    {
      id: 2,
      type: 'comment',
      title: 'Novo comentário',
      message: 'Maria Santos comentou: "Excelente dica! Vou aplicar no meu próximo projeto."',
      user: {
        id: 3,
        name: 'Maria Santos',
        role_label: 'Arquiteta',
        avatar: null
      },
      is_read: false,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h atrás
      action_url: '/profile',
      icon: 'message'
    },
    {
      id: 3,
      type: 'follow',
      title: 'Novo seguidor',
      message: 'Carlos Oliveira começou a seguir você',
      user: {
        id: 4,
        name: 'Carlos Oliveira',
        role_label: 'Construtor',
        avatar: null
      },
      is_read: true,
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4h atrás
      action_url: '/profile/4',
      icon: 'user-plus'
    },
    {
      id: 4,
      type: 'sale',
      title: 'Produto vendido',
      message: 'Seu produto "Cimento Portland 50kg" foi vendido para Ana Costa',
      user: {
        id: 5,
        name: 'Ana Costa',
        role_label: 'Cliente',
        avatar: null
      },
      is_read: true,
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6h atrás
      action_url: '/my-products',
      icon: 'shopping-cart'
    },
    {
      id: 5,
      type: 'review',
      title: 'Nova avaliação',
      message: 'Pedro Lima avaliou seu produto com 5 estrelas: "Produto de excelente qualidade!"',
      user: {
        id: 6,
        name: 'Pedro Lima',
        role_label: 'Cliente',
        avatar: null
      },
      is_read: true,
      created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12h atrás
      action_url: '/my-products',
      icon: 'star'
    },
    {
      id: 6,
      type: 'message',
      title: 'Nova mensagem',
      message: 'Fernanda Rocha enviou uma mensagem: "Olá! Gostaria de saber mais sobre seus serviços."',
      user: {
        id: 7,
        name: 'Fernanda Rocha',
        role_label: 'Cliente',
        avatar: null
      },
      is_read: false,
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 dia atrás
      action_url: '/messages?user=7',
      icon: 'message-circle'
    }
  ];

  const filterOptions = [
    { id: 'all', name: 'Todas', count: 0 },
    { id: 'unread', name: 'Não lidas', count: 0 },
    { id: 'like', name: 'Curtidas', count: 0 },
    { id: 'comment', name: 'Comentários', count: 0 },
    { id: 'follow', name: 'Seguidores', count: 0 },
    { id: 'sale', name: 'Vendas', count: 0 }
  ];

  // Inicialização imediata dos dados demo
  useEffect(() => {
    try {
      // Carregar dados demo imediatamente
      const demoNotifications = getDemoNotifications();
      setNotifications(demoNotifications);
      
      // Calcular não lidas
      const unread = demoNotifications.filter(n => !n.is_read).length;
      setUnreadCount(unread);
      
    } catch (error) {
      console.error('Erro na inicialização do Notifications:', error);
      // Mesmo com erro, garantir dados básicos
      setNotifications(getDemoNotifications());
    }
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      // Atualizar imediatamente na UI
      setNotifications(prevNotifications => {
        if (!Array.isArray(prevNotifications)) return getDemoNotifications();
        
        return prevNotifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        );
      });

      // Atualizar contador
      setUnreadCount(prev => Math.max(0, prev - 1));

      // Tentar API em background
      try {
        await api.put(`/notifications/${notificationId}/read`);
      } catch (apiError) {
        console.log('API não disponível, marcação salva localmente');
      }
      
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Atualizar imediatamente na UI
      setNotifications(prevNotifications => {
        if (!Array.isArray(prevNotifications)) return getDemoNotifications();
        
        return prevNotifications.map(notification => ({
          ...notification,
          is_read: true
        }));
      });

      setUnreadCount(0);

      // Tentar API em background
      try {
        await api.put('/notifications/mark-all-read');
      } catch (apiError) {
        console.log('API não disponível, marcação salva localmente');
      }
      
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      // Remover imediatamente da UI
      setNotifications(prevNotifications => {
        if (!Array.isArray(prevNotifications)) return getDemoNotifications();
        
        const filtered = prevNotifications.filter(n => n.id !== notificationId);
        
        // Atualizar contador se a notificação removida não estava lida
        const removedNotification = prevNotifications.find(n => n.id === notificationId);
        if (removedNotification && !removedNotification.is_read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        
        return filtered;
      });

      // Tentar API em background
      try {
        await api.delete(`/notifications/${notificationId}`);
      } catch (apiError) {
        console.log('API não disponível, exclusão salva localmente');
      }
      
    } catch (error) {
      console.error('Erro ao excluir notificação:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    // Marcar como lida se não estiver
    if (!notification.is_read) {
      markAsRead(notification.id);
    }

    // Navegar para a URL da ação
    if (notification.action_url) {
      navigate(notification.action_url);
    }
  };

  const getNotificationIcon = (type, iconName) => {
    const iconProps = { className: "w-5 h-5" };
    
    switch (iconName || type) {
      case 'heart':
      case 'like':
        return <Heart {...iconProps} className="w-5 h-5 text-red-500" />;
      case 'message':
      case 'comment':
        return <MessageCircle {...iconProps} className="w-5 h-5 text-blue-500" />;
      case 'user-plus':
      case 'follow':
        return <UserPlus {...iconProps} className="w-5 h-5 text-green-500" />;
      case 'shopping-cart':
      case 'sale':
        return <ShoppingCart {...iconProps} className="w-5 h-5 text-purple-500" />;
      case 'star':
      case 'review':
        return <Star {...iconProps} className="w-5 h-5 text-yellow-500" />;
      case 'message-circle':
        return <MessageCircle {...iconProps} className="w-5 h-5 text-indigo-500" />;
      default:
        return <Bell {...iconProps} className="w-5 h-5 text-gray-500" />;
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

  // Notificações filtradas com proteção TOTAL
  const filteredNotifications = useMemo(() => {
    if (!notifications || !Array.isArray(notifications)) {
      return getDemoNotifications();
    }

    const validNotifications = notifications.filter(n => n && typeof n === 'object' && n.id);

    if (filter === 'all') {
      return validNotifications;
    } else if (filter === 'unread') {
      return validNotifications.filter(n => !n.is_read);
    } else {
      return validNotifications.filter(n => n.type === filter);
    }
  }, [notifications, filter]);

  // Contadores para os filtros
  const filterCounts = useMemo(() => {
    if (!notifications || !Array.isArray(notifications)) {
      const demo = getDemoNotifications();
      return {
        all: demo.length,
        unread: demo.filter(n => !n.is_read).length,
        like: demo.filter(n => n.type === 'like').length,
        comment: demo.filter(n => n.type === 'comment').length,
        follow: demo.filter(n => n.type === 'follow').length,
        sale: demo.filter(n => n.type === 'sale').length
      };
    }

    const validNotifications = notifications.filter(n => n && typeof n === 'object');
    
    return {
      all: validNotifications.length,
      unread: validNotifications.filter(n => !n.is_read).length,
      like: validNotifications.filter(n => n.type === 'like').length,
      comment: validNotifications.filter(n => n.type === 'comment').length,
      follow: validNotifications.filter(n => n.type === 'follow').length,
      sale: validNotifications.filter(n => n.type === 'sale').length
    };
  }, [notifications]);

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
              <span className="text-2xl font-bold text-white">Notificações</span>
              {unreadCount > 0 && (
                <span 
                  className="px-2 py-1 text-xs font-bold text-white rounded-full"
                  style={{ backgroundColor: orcamentariaColors.accent }}
                >
                  {unreadCount}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-4">
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

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Actions Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-700">Filtrar por:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {filterOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => setFilter(option.id)}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm transition-colors ${
                    filter === option.id
                      ? 'text-white'
                      : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                  }`}
                  style={{ 
                    backgroundColor: filter === option.id ? orcamentariaColors.primary : undefined 
                  }}
                >
                  <span>{option.name}</span>
                  <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                    filter === option.id 
                      ? 'bg-white bg-opacity-20' 
                      : 'bg-gray-200'
                  }`}>
                    {filterCounts[option.id] || 0}
                  </span>
                </button>
              ))}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Marcar todas como lidas</span>
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {filter === 'unread' ? 'Nenhuma notificação não lida' : 'Nenhuma notificação'}
              </h3>
              <p className="text-gray-600">
                {filter === 'unread' 
                  ? 'Todas as suas notificações foram lidas.' 
                  : 'Você não tem notificações no momento.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.is_read ? 'bg-blue-50 border-l-4' : ''
                  }`}
                  style={{ 
                    borderLeftColor: !notification.is_read ? orcamentariaColors.primary : 'transparent' 
                  }}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type, notification.icon)}
                    </div>

                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                        style={{ backgroundColor: orcamentariaColors.secondary }}
                      >
                        {notification.user?.avatar ? (
                          <img 
                            src={notification.user.avatar} 
                            alt="Avatar" 
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          notification.user?.name?.charAt(0) || 'U'
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{notification.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {formatDate(notification.created_at)}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.is_read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="p-1 text-gray-400 hover:text-green-500 transition-colors"
                              title="Marcar como lida"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            title="Excluir notificação"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        {filteredNotifications.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-600">
            Mostrando {filteredNotifications.length} de {filterCounts.all} notificações
            {unreadCount > 0 && (
              <span> • {unreadCount} não lidas</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}