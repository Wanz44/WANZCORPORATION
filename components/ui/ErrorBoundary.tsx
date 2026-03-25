import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      let errorMessage = "Une erreur inattendue s'est produite.";
      let isFirestoreError = false;

      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error && parsed.operationType) {
            isFirestoreError = true;
            errorMessage = `Erreur de base de données : ${parsed.error}`;
          }
        }
      } catch (e) {
        // Not a JSON error message
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen bg-brand-dark flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full glass border border-white/10 rounded-[2.5rem] p-8 text-center shadow-2xl">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-red-500" size={40} />
            </div>
            
            <h1 className="text-2xl font-black text-white uppercase tracking-widest mb-4">
              Oups ! Quelque chose a mal tourné
            </h1>
            
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              {errorMessage}
            </p>

            {isFirestoreError && (
              <div className="bg-white/5 rounded-2xl p-4 mb-8 text-left">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">Détails techniques</p>
                <code className="text-[10px] text-red-400 break-all">
                  {this.state.error?.message}
                </code>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-6 rounded-2xl transition-all"
              >
                <RefreshCcw size={18} />
                <span className="text-xs uppercase tracking-widest">Actualiser</span>
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center space-x-2 bg-brand-accent text-brand-dark font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-brand-accent/20"
              >
                <Home size={18} />
                <span className="text-xs uppercase tracking-widest">Accueil</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
