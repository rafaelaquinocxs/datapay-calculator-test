import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback 
          error={this.state.error}
          resetError={() => this.setState({ hasError: false, error: null, errorInfo: null })}
        />
      );
    }

    return this.props.children;
  }
}

function ErrorFallback({ error, resetError }) {
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: orcamentariaColors.lightGray }}>
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: orcamentariaColors.light }}
          >
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Ops! Algo deu errado
          </h1>
          
          <p className="text-gray-600 mb-6">
            Ocorreu um erro inesperado. Não se preocupe, você pode tentar novamente.
          </p>

          {process.env.NODE_ENV === 'development' && error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-medium text-red-800 mb-2">Detalhes do erro:</h3>
              <pre className="text-xs text-red-700 overflow-auto">
                {error.toString()}
              </pre>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={resetError}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-white rounded-lg transition-colors"
              style={{ backgroundColor: orcamentariaColors.primary }}
            >
              <RefreshCw className="w-5 h-5" />
              <span>Tentar novamente</span>
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Voltar ao início</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorBoundary;