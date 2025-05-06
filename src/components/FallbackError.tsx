
import React from 'react';
import { AlertCircle, RefreshCw, DatabaseBackup } from 'lucide-react';
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
  // Handle data issues specifically - this is specialized for our dropdown problems
  const handleDataReset = () => {
    if (window.confirm("This will reset problematic data that might be causing dropdown errors. Continue?")) {
      // A soft reset of just the problematic data
      try {
        localStorage.removeItem('options-cache');
        sessionStorage.removeItem('dropdown-state');
        
        // If we're in the purchases section, clean that specific data
        if (window.location.pathname.includes('purchases')) {
          localStorage.removeItem('purchase-form-state');
        }
        
        // Force a hard refresh
        window.location.reload();
      } catch (e) {
        console.error("Error during data reset:", e);
        // If reset fails, just do a normal refresh
        window.location.reload();
      }
    }
  };

  return (
    <div className="p-6 bg-red-50 border border-red-200 rounded-lg shadow-sm max-w-lg mx-auto my-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-lg text-red-800">{message}</h3>
          {error && (
            <div className="mt-2 p-2 bg-white rounded border border-red-100 overflow-auto max-h-[120px] text-left">
              <pre className="text-xs text-gray-700">{error.message}</pre>
            </div>
          )}
          
          <div className="mt-4 flex flex-col gap-2">
            {resetErrorBoundary && (
              <Button 
                onClick={resetErrorBoundary} 
                variant="outline" 
                className="border-red-300 hover:bg-red-50 text-red-700 flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </Button>
            )}
            
            {error?.message?.includes("undefined is not iterable") && (
              <Button 
                onClick={handleDataReset}
                variant="destructive" 
                className="flex items-center gap-2"
              >
                <DatabaseBackup className="h-4 w-4" />
                Reset Problematic Data
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FallbackError;
