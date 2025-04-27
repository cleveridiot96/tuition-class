
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Check for specific common errors
      const isToFixedError = this.state.error?.message.includes('toFixed is not a function');
      const isTypeError = this.state.error instanceof TypeError;

      return (
        <div className="p-4 border border-red-300 rounded-md bg-red-50 text-red-800">
          <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
          <p className="mb-3">An error occurred in this component. The application is still running.</p>
          <p className="text-sm mb-3 font-mono bg-white p-2 rounded border border-red-200 overflow-auto">
            {this.state.error?.toString() || "Unknown error"}
          </p>
          {isToFixedError && (
            <p className="text-sm mb-3 italic">
              This appears to be a number formatting error. Please check that all numeric values are valid.
            </p>
          )}
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
