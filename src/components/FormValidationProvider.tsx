
import React, { useEffect } from 'react';
import { useFormValidation } from '@/hooks/useFormValidation';

const FormValidationProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const validation = useFormValidation();
  
  // Add global form submission handler to add ripple effect for server-side validation errors
  useEffect(() => {
    const handleServerValidationErrors = (event: CustomEvent) => {
      const { errors } = event.detail;
      if (errors && Array.isArray(errors)) {
        validation.highlightErrors(errors, { 
          scrollToError: true,
          highlightWithRipple: true,
          showToast: true
        });
      }
    };
    
    // Listen for custom event that your API response handlers would dispatch
    window.addEventListener('server-validation-errors', handleServerValidationErrors as EventListener);
    
    return () => {
      window.removeEventListener('server-validation-errors', handleServerValidationErrors as EventListener);
    };
  }, [validation]);
  
  return <>{children}</>;
};

export default FormValidationProvider;
