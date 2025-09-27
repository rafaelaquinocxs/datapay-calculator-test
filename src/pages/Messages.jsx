import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Send, 
  Phone, 
  Video, 
  MoreVertical,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  Circle,
  MessageCircle
} from 'lucide-react';
import api from '../services/api';

export default function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

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

  useEffect(() => {
    loadConversations();
    
    // Se há um parâmetro de usuário na URL, iniciar conversa
    const userId = searchParams.get('user');
    if (userId) {
      startConversationWithUser(userId);
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/messages/conversations');
      
      if (response.data && response.data.data) {
        setConversations(response.data.data);
      } else {
        // Conversas demo para fallback
        setConversations([
          {
            id: 1,
            participant: {
              id: 2,
              name: 'João Silva',
              role_label: 'Arquiteto',
              avatar: null,
              online: true
            },
            last_message: {
              content: 'Oi! Vi seu post sobre o projeto residencial. Podemos conversar?',
              created_at: new Date(Date.now() - 300000).toISOString(),
              sender_id: 2
            },
            unread_count: 2
          },
          {
            id: 2,
            participant: {
              id: 3,
              name: 'Maria Santos',
              role_label: 'Engenheira Civil',
              avatar: null,
              online: false
            },
            last_message: {
              content: 'Obrigada pelas dicas sobre fundações!',
              created_at: new Date(Date.now() - 3600000).toISOString(),
              sender_id: 3
            },
            unread_count: 0
          },
          {
            id: 3,
            participant: {
              id: 4,
              name: 'Materiais Pro',
              role_label: 'Lojista',
              avatar: null,
              online: true
            },
            last_message: {
              content: 'Temos promoção em cimento esta semana!',
              created_at: new Date(Date.now() - 7200000).toISOString(),
              sender_id: 4
            },
            unread_count: 1
          }
        ]);
      }
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const startConversationWithUser = async (userId) => {
    try {
      // Verificar se já existe conversa com este usuário
      const existingConversation = conversations.find(
        conv => conv.participant.id == userId
      );
      
      if (existingConversation) {
        setSelectedConversation(existingConversation);
        return;
      }

      // Criar nova conversa (simulada)
      const newConversation = {
        id: Date.now(),
        participant: {
          id: parseInt(userId),
          name: 'Novo Contato',
          role_label: 'Usuário',
          avatar: null,
          online: false
        },
        last_message: null,
        unread_count: 0
      };

      setConversations([newConversation, ...conversations]);
      setSelectedConversation(newConversation);
    } catch (error) {
      console.error('Erro ao iniciar conversa:', error);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const response = await api.get(`/messages/conversations/${conversationId}`);
      
      if (response.data && response.data.data) {
        setMessages(response.data.data);
      } else {
        // Mensagens demo para fallback
        const demoMessages = [
          {
            id: 1,
            content: 'Oi! Como está?',
            sender_id: selectedConversation.participant.id,
            created_at: new Date(Date.now() - 3600000).toISOString(),
            read: true
          },
          {
            id: 2,
            content: 'Oi! Tudo bem, obrigado! E você?',
            sender_id: user.id,
            created_at: new Date(Date.now() - 3300000).toISOString(),
            read: true
          },
          {
            id: 3,
            content: 'Vi seu post sobre o projeto residencial. Ficou muito interessante!',
            sender_id: selectedConversation.participant.id,
            created_at: new Date(Date.now() - 1800000).toISOString(),
            read: true
          },
          {
            id: 4,
            content: 'Obrigado! Foi um projeto desafiador mas o resultado ficou ótimo.',
            sender_id: user.id,
            created_at: new Date(Date.now() - 1500000).toISOString(),
            read: true
          },
          {
            id: 5,
            content: 'Podemos conversar sobre uma possível parceria?',
            sender_id: selectedConversation.participant.id,
            created_at: new Date(Date.now() - 300000).toISOString(),
            read: false
          }
        ];
        setMessages(demoMessages);
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSendingMessage(true);
      
      const messageData = {
        content: newMessage,
        conversation_id: selectedConversation.id
      };

      // Adicionar mensagem localmente primeiro
      const tempMessage = {
        id: Date.now(),
        content: newMessage,
        sender_id: user.id,
        created_at: new Date().toISOString(),
        read: false,
        sending: true
      };

      setMessages([...messages, tempMessage]);
      setNewMessage('');

      // Enviar para API
      const response = await api.post('/messages', messageData);
      
      if (response.data && response.data.data) {
        // Atualizar mensagem com dados reais
        setMessages(prev => prev.map(msg => 
          msg.id === tempMessage.id ? { ...response.data.data, sending: false } : msg
        ));
      } else {
        // Simular sucesso
        setMessages(prev => prev.map(msg => 
          msg.id === tempMessage.id ? { ...msg, sending: false } : msg
        ));
      }

      // Atualizar última mensagem na conversa
      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { 
              ...conv, 
              last_message: {
                content: newMessage,
                created_at: new Date().toISOString(),
                sender_id: user.id
              }
            }
          : conv
      ));

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      // Remover mensagem em caso de erro
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
    } finally {
      setSendingMessage(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'agora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'ontem';
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen flex" style={{ backgroundColor: orcamentariaColors.lightGray }}>
      {/* Sidebar - Lista de conversas */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header da sidebar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Mensagens</h1>
            <div></div>
          </div>
          
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar conversas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': orcamentariaColors.primary }}
            />
          </div>
        </div>

        {/* Lista de conversas */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <div 
                className="animate-spin rounded-full h-8 w-8 border-b-4 mx-auto mb-2"
                style={{ borderColor: orcamentariaColors.primary }}
              ></div>
              <p className="text-gray-600 text-sm">Carregando...</p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-4 text-center">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Nenhuma conversa encontrada</p>
            </div>
          ) : (
            filteredConversations.map(conversation => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
                      style={{ backgroundColor: orcamentariaColors.primary }}
                    >
                      {conversation.participant.avatar ? (
                        <img 
                          src={conversation.participant.avatar} 
                          alt="Avatar" 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        conversation.participant.name.charAt(0)
                      )}
                    </div>
                    {conversation.participant.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  {/* Info da conversa */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 truncate">
                        {conversation.participant.name}
                      </h3>
                      {conversation.last_message && (
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.last_message.created_at)}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-1">{conversation.participant.role_label}</p>
                    
                    {conversation.last_message && (
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.last_message.sender_id === user.id ? 'Você: ' : ''}
                          {conversation.last_message.content}
                        </p>
                        {conversation.unread_count > 0 && (
                          <div 
                            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                            style={{ backgroundColor: orcamentariaColors.primary }}
                          >
                            {conversation.unread_count}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Área de mensagens */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Header da conversa */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                    style={{ backgroundColor: orcamentariaColors.primary }}
                  >
                    {selectedConversation.participant.avatar ? (
                      <img 
                        src={selectedConversation.participant.avatar} 
                        alt="Avatar" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      selectedConversation.participant.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">{selectedConversation.participant.name}</h2>
                    <p className="text-sm text-gray-600">
                      {selectedConversation.participant.online ? 'Online' : 'Offline'} • {selectedConversation.participant.role_label}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender_id === user.id
                      ? 'text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                  style={{ 
                    backgroundColor: message.sender_id === user.id ? orcamentariaColors.primary : undefined 
                  }}>
                    <p className="text-sm">{message.content}</p>
                    <div className={`flex items-center justify-end space-x-1 mt-1 ${
                      message.sender_id === user.id ? 'text-white text-opacity-70' : 'text-gray-500'
                    }`}>
                      <span className="text-xs">{formatTime(message.created_at)}</span>
                      {message.sender_id === user.id && (
                        <div className="text-xs">
                          {message.sending ? (
                            <Circle className="w-3 h-3" />
                          ) : message.read ? (
                            <CheckCheck className="w-3 h-3" />
                          ) : (
                            <Check className="w-3 h-3" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input de mensagem */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <button className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': orcamentariaColors.primary }}
                    disabled={sendingMessage}
                  />
                </div>

                <button className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <Smile className="w-5 h-5" />
                </button>

                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || sendingMessage}
                  className="p-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: orcamentariaColors.primary }}
                >
                  {sendingMessage ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Estado vazio */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione uma conversa</h3>
              <p className="text-gray-600">Escolha uma conversa da lista para começar a conversar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}