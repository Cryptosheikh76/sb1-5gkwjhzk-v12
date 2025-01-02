import { Component, ErrorInfo, ReactNode } from 'react';
import { monitoring } from '../lib/monitoring';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    monitoring.captureError(error, {
      component: 'ErrorBoundary',
      ...errorInfo
    });
  }

  private handleRefresh = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-zinc-900">
          <div className="text-center p-8 bg-zinc-800 rounded-lg shadow-xl max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-white">Something went wrong</h2>
            <p className="text-zinc-400 mb-6">
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            <button
              onClick={this.handleRefresh}
              className="px-4 py-2 bg-primary text-black font-bold rounded hover:bg-primary/90 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}