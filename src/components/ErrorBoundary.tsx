import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error);
    console.error("Component stack:", errorInfo.componentStack);
    
    // Update state with error details
    this.setState({
      error,
      errorInfo
    });
  }

  handleRetry = (): void => {
    // Try recovering by clearing the error state
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null
    });
    
    // Force a hard refresh if the error is likely to persist without it
    if (this.state.error?.message?.includes("undefined is not iterable") || 
        this.state.error?.message?.includes("toFixed is not a function")) {
      window.location.reload();
    }
  };

  handleDataReset = (): void => {
    // For severe data corruption, offer a way to clear problematic data
    if (window.confirm("This will reset problematic data that might be causing errors. Continue?")) {
      // Clear session storage and perform a hard refresh
      sessionStorage.clear();
      window.location.reload();
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // If a custom fallback is provided, use that
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Otherwise use the default error UI
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
          <div className="bg-red-50 border border-red-200 rounded-md p-6 max-w-md">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="h-10 w-10 text-red-500" />
            </div>
            
            <h2 className="text-xl font-semibold text-red-700 mb-2">Something went wrong</h2>
            
            <p className="text-red-600 mb-4">
              An error occurred in this component. The application is still running.
            </p>
            
            {this.state.error && (
              <div className="p-3 bg-white rounded border border-red-100 mb-4 overflow-auto max-h-[150px] text-left">
                <pre className="text-sm text-gray-700">
                  {this.state.error.message || 'Unknown error'}
                </pre>
              </div>
            )}
            
            <div className="space-y-3">
              <Button 
                onClick={this.handleRetry}
                variant="outline" 
                className="w-full border-red-300 hover:bg-red-50 text-red-700 flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              
              {this.state.error?.message?.includes("undefined is not iterable") && (
                <Button 
                  onClick={this.handleDataReset}
                  variant="destructive"
                  className="w-full"
                >
                  Reset Problematic Data
                </Button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
