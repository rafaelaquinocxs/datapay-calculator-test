import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SupplierRoute from './components/SupplierRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Messages from './pages/Messages';
import MyProducts from './pages/MyProducts';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import MeusPontos from './pages/MeusPontos';
import MeusOrcamentos from './pages/MeusOrcamentos';
import MeusProdutos from './pages/MyProducts';
import MinhaLoja from './pages/MinhaLoja';
import './App.css';

// Componente para proteger rotas que precisam de autenticação
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: '#A0453F' }}
          ></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Componente para redirecionar usuários autenticados
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: '#A0453F' }}
          ></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Rotas públicas */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } 
            />
            
            {/* Rotas protegidas */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/marketplace" 
              element={
                <ProtectedRoute>
                  <Marketplace />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/messages" 
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-products" 
              element={
                <ProtectedRoute>
                  <MyProducts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/notifications" 
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile/:userId" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/meus-pontos" 
              element={
                <ProtectedRoute>
                  <MeusPontos />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/meus-orcamentos" 
              element={
                <ProtectedRoute>
                  <MeusOrcamentos />
                </ProtectedRoute>
              } 
            />
            
            {/* Rotas exclusivas para fornecedores (COMPANY ou SERVICE_PROVIDER) */}
            <Route 
              path="/meus-produtos" 
              element={
                <SupplierRoute>
                  <MyProducts />
                </SupplierRoute>
              } 
            />
            <Route 
              path="/minha-loja" 
              element={
                <SupplierRoute>
                  <MinhaLoja />
                </SupplierRoute>
              } 
            />
            
            {/* Rota padrão - redireciona para home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
