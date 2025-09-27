🚀 Funcionalidades

👥 Rede Social

•
Feed interativo com posts, curtidas e comentários

•
Sistema de localização nos posts

•
Upload de fotos (apenas imagens)

•
Perfis personalizados por tipo de usuário

🏪 Marketplace

•
Catálogo de produtos com filtros avançados

•
Sistema de categorias organizadas

•
Busca inteligente por produtos

💬 Comunicação

•
Sistema de mensagens privadas

•
Notificações em tempo real

•
Chat integrado entre usuários

🏢 Área Empresarial (Apenas para Empresas)

•
Meus Produtos - Gerenciamento completo de produtos

•
Minha Loja - Dashboard de vendas e métricas

•
Controle de estoque e preços

•
Análise de performance

🎯 Gamificação

•
Sistema de pontos por atividades

•
Recompensas e conquistas

•
Ranking de usuários

👤 Tipos de Usuário

Tipo
Descrição
Acesso Especial
COMPANY
Empresas e Lojistas
✅ Meus Produtos + Minha Loja
ARCHITECT
Arquitetos
⚡ Funcionalidades básicas
ENGINEER
Engenheiros
⚡ Funcionalidades básicas
SERVICE_PROVIDER
Prestadores de Serviço
⚡ Funcionalidades básicas
USER
Usuários Comuns
⚡ Funcionalidades básicas
CUSTOMER
Clientes
⚡ Funcionalidades básicas


🛠️ Tecnologias

•
Frontend: React 18 + Vite

•
Roteamento: React Router v6

•
Estilização: Tailwind CSS

•
Ícones: Lucide React

•
Autenticação: Context API + JWT

•
API: Integração com API REST

📦 Instalação

Pré-requisitos

•
Node.js 18+

•
npm ou yarn

Passos

1.
Clone o repositório

Bash


git clone https://github.com/seu-usuario/orcamentaria.git
cd orcamentaria


1.
Instale as dependências

Bash


npm install


1.
Configure as variáveis de ambiente

Bash


# Crie um arquivo .env na raiz do projeto
VITE_API_URL=https://api-dev.orcamentaria.com/api/v1


1.
Execute a aplicação

Bash


npm run dev


1.
Acesse no navegador

Plain Text


http://localhost:5173


🎮 Como Testar

1. Cadastro de Usuário

•
Acesse /register

•
Escolha o tipo "Empresa" para ter acesso completo

•
Preencha todos os campos obrigatórios

•
CNPJ: Use um CNPJ válido (ex: 11.222.333/0001-81)

•
Telefone: Use formato brasileiro (ex: (11) 99999-9999)

2. Login

•
Acesse /login

•
Use as credenciais criadas no cadastro

•
A aplicação redirecionará para o feed principal

3. Navegação

•
Home: Feed principal com posts

•
Profile: Perfil do usuário (empresas veem menus extras)

•
Marketplace: Catálogo de produtos

•
Mensagens: Sistema de chat

•
Notificações: Central de notificações

4. Funcionalidades Empresariais (Apenas COMPANY)

•
Meus Produtos: Gerenciar catálogo de produtos

•
Minha Loja: Dashboard com métricas de vendas

•
Acesse via sidebar no perfil ou diretamente pelas URLs:

•
/meus-produtos

•
/minha-loja



🎨 Design System

Cores da Orçamentaria

CSS


Primary: #A0453F    /* Marrom principal */
Secondary: #7A3530  /* Marrom escuro */
Accent: #C85A54     /* Marrom claro */
Light: #D4726C      /* Tom suave */
Dark: #5D2520       /* Tom escuro */


Componentes

•
Botões: Bordas arredondadas com hover effects

•
Cards: Sombras suaves e espaçamento consistente

•
Formulários: Validação visual e placeholders informativos

•
Navegação: Sidebar responsiva com estados ativos

📱 Responsividade

•
Desktop: Layout completo com sidebar

•
Tablet: Sidebar colapsável

•
Mobile: Navegação adaptada e cards empilhados

🔒 Autenticação

Sistema de Proteção de Rotas

•
Rotas Públicas: /login, /register

•
Rotas Protegidas: Todas as outras (requer login)

•
Rotas Empresariais: /meus-produtos, /minha-loja (apenas COMPANY)

Fluxo de Autenticação

1.
Login via API REST

2.
Token JWT armazenado no localStorage

3.
Dados do usuário persistidos localmente

4.
Verificação automática de sessão

🚧 Dados Demo

A aplicação funciona com dados demonstrativos quando a API não está disponível:

•
Posts do feed social

•
Produtos do marketplace

•
Mensagens e notificações

•
Métricas da loja

📝 Scripts Disponíveis

Bash


npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Verificação de código

