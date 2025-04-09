
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FallbackErrorProps {
  error?: Error;
  resetErrorBoundary?: () => void;
  message?: string;
}

const FallbackError: React.FC<FallbackErrorProps> = ({ 
  error, 
  resetErrorBoundary,
  message = "Something went wrong" 
}) => {
  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-lg shadow-sm max-w-lg mx-auto my-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-lg text-red-800">{message}</h3>
          {error && (
            <div className="mt-2 p-2 bg-white rounded border border-red-100 overflow-auto max-h-[120px]">
              <pre className="text-xs text-gray-700">{error.message}</pre>
            </div>
          )}
          {resetErrorBoundary && (
            <Button 
              onClick={resetErrorBoundary} 
              variant="outline" 
              className="mt-4 border-red-300 hover:bg-red-50 text-red-700 flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FallbackError;
