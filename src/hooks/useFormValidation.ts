
import { useRef, useCallback } from "react";
import { toast } from "sonner";

interface FormFieldError {
  fieldName: string;
  message: string;
  element?: HTMLElement;
}

interface ValidationOptions {
  scrollToError?: boolean;
  highlightWithRipple?: boolean;
  showToast?: boolean;
}

/**
 * Custom hook for enhanced form validation with ripple effect highlighting
 */
export const useFormValidation = () => {
  const errorsRef = useRef<FormFieldError[]>([]);

  /**
   * Creates a ripple effect on an element to highlight errors
   */
  const createRippleEffect = useCallback((element: HTMLElement) => {
    // Remove any existing ripple elements
    const existingRipple = element.querySelector('.error-ripple');
    if (existingRipple) {
      element.removeChild(existingRipple);
    }
    
    // Create new ripple element
    const ripple = document.createElement('span');
    ripple.className = 'error-ripple';
    element.appendChild(ripple);
    
    // Set styles for ripple
    const style = ripple.style;
    const rect = element.getBoundingClientRect();
    
    style.width = style.height = `${Math.max(rect.width, rect.height) * 2}px`;
    style.position = 'absolute';
    style.left = '50%';
    style.top = '50%';
    style.transform = 'translate(-50%, -50%) scale(0)';
    style.opacity = '1';
    style.borderRadius = '50%';
    style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
    style.pointerEvents = 'none';
    style.zIndex = '1000';
    
    // Animate the ripple
    ripple.animate(
      [
        { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 0 }
      ],
      {
        duration: 1000,
        iterations: 2
      }
    );
    
    // Remove ripple after animation
    setTimeout(() => {
      if (ripple.parentNode === element) {
        element.removeChild(ripple);
      }
    }, 2000);
  }, []);
  
  /**
   * Highlights form field errors with optional ripple effect
   */
  const highlightErrors = useCallback((errors: FormFieldError[], options: ValidationOptions = {}) => {
    errorsRef.current = errors;
    
    if (errors.length === 0) return;
    
    // Add the necessary CSS to the document if it doesn't exist
    if (!document.getElementById('ripple-effect-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'ripple-effect-styles';
      styleEl.textContent = `
        .error-field {
          border: 1px solid #ff5252 !important;
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `;
      document.head.appendChild(styleEl);
    }
    
    // Process each error
    errors.forEach((error) => {
      if (!error.fieldName) return;
      
      // Find the form element by name, id, or other selectors
      const selector = `[name="${error.fieldName}"], #${error.fieldName}, [data-field="${error.fieldName}"], [data-name="${error.fieldName}"]`;
      const element = error.element || document.querySelector(selector);
      
      if (element) {
        // Add error class
        element.classList.add('error-field');
        
        // Create ripple effect if option is enabled
        if (options.highlightWithRipple) {
          createRippleEffect(element as HTMLElement);
        }
      }
      
      // Show toast notification if enabled
      if (options.showToast) {
        toast.error(error.message);
      }
    });
    
    // Scroll to the first error if option is enabled
    if (options.scrollToError && errors.length > 0) {
      const firstErrorElement = 
        errors[0].element || 
        document.querySelector(`[name="${errors[0].fieldName}"], #${errors[0].fieldName}, [data-field="${errors[0].fieldName}"]`);
      
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [createRippleEffect]);
  
  /**
   * Clear all error highlights
   */
  const clearErrorHighlights = useCallback(() => {
    // Remove error classes from all fields
    document.querySelectorAll('.error-field').forEach(el => {
      el.classList.remove('error-field');
    });
    
    errorsRef.current = [];
  }, []);
  
  return {
    highlightErrors,
    clearErrorHighlights,
    currentErrors: errorsRef.current
  };
};

/**
 * Enhances a form's validation by adding error highlighting with ripple effects
 */
export const enhanceFormValidation = (form: any) => {
  const validation = useFormValidation();
  
  return {
    ...validation,
    validateForm: () => {
      validation.clearErrorHighlights();
      
      // Get form errors
      const formState = form.formState || {};
      const errors = formState.errors || {};
      
      // Convert react-hook-form errors to our format
      const fieldErrors: FormFieldError[] = Object.entries(errors).map(([fieldName, error]: [string, any]) => ({
        fieldName,
        message: error.message || `${fieldName} is invalid`
      }));

      // Special case for party/agent validation in purchase forms
      const values = form.getValues ? form.getValues() : {};
      if (('party' in values || 'agentId' in values) && !values.party && !values.agentId) {
        fieldErrors.push({
          fieldName: 'party',
          message: 'Either Supplier Name or Agent must be specified'
        });
      }
      
      if (fieldErrors.length > 0) {
        validation.highlightErrors(fieldErrors, { 
          scrollToError: true,
          highlightWithRipple: true,
          showToast: true
        });
        return false;
      }
      
      return true;
    }
  };
};
