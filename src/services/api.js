import axios from 'axios';

// Configuração base da API seguindo a documentação
const API_BASE_URL = 'https://api-dev.orcamentaria.com/api/v1';

// Criar instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('orcamentaria_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('orcamentaria_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===== AUTENTICAÇÃO =====

export const authAPI = {
  // Login - POST /auth/login
  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password
    });
    
    if (response.data?.data?.token) {
      localStorage.setItem('orcamentaria_token', response.data.data.token);
    }
    
    return response.data;
  },

  // Registro - POST /auth/register
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    
    if (response.data?.data?.token) {
      localStorage.setItem('orcamentaria_token', response.data.data.token);
    }
    
    return response.data;
  },

  // Logout - POST /auth/logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('orcamentaria_token');
    }
  },

  // Recuperar senha - POST /auth/forgot-password
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Resetar senha - POST /auth/reset-password
  resetPassword: async (token, email, password, password_confirmation) => {
    const response = await api.post('/auth/reset-password', {
      token,
      email,
      password,
      password_confirmation
    });
    return response.data;
  }
};

// ===== USUÁRIOS =====

export const usersAPI = {
  // Listar usuários - GET /users
  list: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Exibir usuário - GET /users/{id}
  show: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Seguir usuário - POST /users/{id}/follow
  follow: async (id) => {
    const response = await api.post(`/users/${id}/follow`);
    return response.data;
  },

  // Deixar de seguir - POST /users/{id}/unfollow
  unfollow: async (id) => {
    const response = await api.post(`/users/${id}/unfollow`);
    return response.data;
  },

  // Bloquear usuário - POST /users/{id}/block
  block: async (id) => {
    const response = await api.post(`/users/${id}/block`);
    return response.data;
  },

  // Desbloquear usuário - POST /users/{id}/unblock
  unblock: async (id) => {
    const response = await api.post(`/users/${id}/unblock`);
    return response.data;
  },

  // Atualizar perfil - PUT /users/{id}/profile
  updateProfile: async (id, profileData) => {
    const response = await api.put(`/users/${id}/profile`, profileData);
    return response.data;
  },

  // Deletar usuário - DELETE /users/{id}/delete
  delete: async (id) => {
    const response = await api.delete(`/users/${id}/delete`);
    return response.data;
  }
};

// ===== CATEGORIAS =====

export const categoriesAPI = {
  // Listar categorias - GET /categories
  list: async (only_active = false) => {
    const response = await api.get('/categories', {
      params: { only_active }
    });
    return response.data;
  },

  // Criar categoria - POST /categories
  create: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  // Exibir categoria - GET /categories/{category}
  show: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // Atualizar categoria - PUT /categories/{category}
  update: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  // Deletar categoria - DELETE /categories/{category}
  delete: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }
};

// ===== POSTS =====

export const postsAPI = {
  // Listar posts - GET /posts
  list: async (params = {}) => {
    const response = await api.get('/posts', { params });
    return response.data;
  },

  // Criar post - POST /posts
  create: async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data;
  },

  // Exibir post - GET /posts/{post}
  show: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  // Atualizar post - PUT /posts/{post}
  update: async (id, postData) => {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  },

  // Deletar post - DELETE /posts/{post}
  delete: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  }
};

// ===== CURTIDAS =====

export const likesAPI = {
  // Curtir post - POST /posts/{post}/like
  likePost: async (postId) => {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  },

  // Descurtir post - DELETE /posts/{post}/like
  unlikePost: async (postId) => {
    const response = await api.delete(`/posts/${postId}/like`);
    return response.data;
  },

  // Curtir comentário - POST /posts/{post}/comments/{comment}/like
  likeComment: async (postId, commentId) => {
    const response = await api.post(`/posts/${postId}/comments/${commentId}/like`);
    return response.data;
  },

  // Descurtir comentário - DELETE /posts/{post}/comments/{comment}/like
  unlikeComment: async (postId, commentId) => {
    const response = await api.delete(`/posts/${postId}/comments/${commentId}/like`);
    return response.data;
  }
};

// ===== COMENTÁRIOS =====

export const commentsAPI = {
  // Listar comentários - GET /social/posts/{postId}/comments
  list: async (postId, page = 1) => {
    const response = await api.get(`/social/posts/${postId}/comments`, {
      params: { page }
    });
    return response.data;
  },

  // Criar comentário - POST /social/posts/{postId}/comments
  create: async (postId, content) => {
    const response = await api.post(`/social/posts/${postId}/comments`, {
      content
    });
    return response.data;
  },

  // Excluir comentário - DELETE /social/comments/{commentId}
  delete: async (commentId) => {
    const response = await api.delete(`/social/comments/${commentId}`);
    return response.data;
  }
};

// ===== MENSAGENS =====

export const messagesAPI = {
  // Listar mensagens da conversa - GET /conversations/{conversation}/messages
  list: async (conversationId) => {
    const response = await api.get(`/conversations/${conversationId}/messages`);
    return response.data;
  },

  // Enviar mensagem - POST /conversations/{conversation}/messages
  send: async (conversationId, messageData) => {
    const response = await api.post(`/conversations/${conversationId}/messages`, messageData);
    return response.data;
  }
};

// ===== PEDIDOS =====

export const ordersAPI = {
  // Listar pedidos do comprador - GET /orders
  list: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  // Criar pedido - POST /orders
  create: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Listar pedidos recebidos (vendedor) - GET /orders/received
  received: async () => {
    const response = await api.get('/orders/received');
    return response.data;
  },

  // Atualizar status do pedido - PUT /orders/{orderId}/status
  updateStatus: async (orderId, status) => {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  }
};

// ===== NOTIFICAÇÕES =====

export const notificationsAPI = {
  // Listar notificações - GET /notifications
  list: async (params = {}) => {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  // Marcar como lida - PUT /notifications/{notification}/read
  markAsRead: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Marcar todas como lidas - PUT /notifications/read-all
  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },

  // Deletar notificação - DELETE /notifications/{notification}
  delete: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  }
};

// ===== UPLOADS =====

export const uploadsAPI = {
  // Upload de imagem - POST /uploads/image
  uploadImage: async (imageFile, type = 'POST') => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('type', type);

    const response = await api.post('/uploads/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export default api;
