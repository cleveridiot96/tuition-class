
import { useRef } from 'react';
import { toast } from 'sonner';

export interface FormFieldError {
  fieldName: string;
  message: string;
  element?: HTMLElement | null;
}

export interface ValidationOptions {
  scrollToError?: boolean;
  highlightWithRipple?: boolean;
  showToast?: boolean;
}

export const useFormValidation = () => {
  const errorsRef = useRef<FormFieldError[]>([]);
  
  /**
   * Creates a ripple effect on an element to highlight errors
   */
  const createRippleEffect = (element: HTMLElement) => {
    // Remove any existing ripple elements
    const existingRipple = element.querySelector('.error-ripple');
    if (existingRipple) {
      existingRipple.parentNode?.removeChild(existingRipple);
    }
    
    // Create new ripple element
    const ripple = document.createElement('span');
    ripple.className = 'error-ripple';
    
    // Apply styles directly since we can't guarantee the CSS exists
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '1000';
    
    // Make the parent position relative if it's not already
    const computedStyle = window.getComputedStyle(element);
    if (computedStyle.position === 'static') {
      element.style.position = 'relative';
    }
    
    // Append ripple to element
    element.appendChild(ripple);
    
    // Set ripple dimensions and position
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.transform = 'translate(-50%, -50%) scale(0)';
    ripple.style.opacity = '1';
    
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
    
    // Add shake animation to the input
    element.animate(
      [
        { transform: 'translate3d(-1px, 0, 0)' },
        { transform: 'translate3d(2px, 0, 0)' },
        { transform: 'translate3d(-4px, 0, 0)' },
        { transform: 'translate3d(4px, 0, 0)' },
        { transform: 'translate3d(-4px, 0, 0)' },
        { transform: 'translate3d(4px, 0, 0)' },
        { transform: 'translate3d(-4px, 0, 0)' },
        { transform: 'translate3d(2px, 0, 0)' },
        { transform: 'translate3d(-1px, 0, 0)' }
      ],
      {
        duration: 500,
        easing: 'cubic-bezier(.36,.07,.19,.97)'
      }
    );
    
    // Add error class to highlight the element
    element.classList.add('error-field');
    
    // Remove ripple after animation
    setTimeout(() => {
      if (ripple.parentNode === element) {
        element.removeChild(ripple);
      }
    }, 2000);
    
    // Remove error class after a delay
    setTimeout(() => {
      element.classList.remove('error-field');
    }, 5000);
  };
  
  /**
   * Highlights form field errors with optional ripple effect
   */
  const highlightErrors = (errors: FormFieldError[], options: ValidationOptions = {}) => {
    errorsRef.current = errors;
    
    if (errors.length === 0) return;
    
    // Add the necessary CSS to the document if it doesn't exist
    if (!document.getElementById('ripple-effect-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'ripple-effect-styles';
      styleEl.textContent = `
        .error-ripple {
          position: absolute;
          border-radius: 50%;
          background-color: rgba(255, 0, 0, 0.3);
          pointer-events: none;
          z-index: 1000;
        }
        .error-field {
          border: 1px solid #ff5252 !important;
          box-shadow: 0 0 0 1px #ff5252 !important;
        }
        .field-error-message {
          color: #ff5252;
          font-size: 0.75rem;
          margin-top: 4px;
          margin-bottom: 8px;
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
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
    
    // If option is enabled, show toast with first error
    if (options.showToast && errors.length > 0) {
      toast.error("Form validation error", {
        description: errors[0].message || "Please fix the highlighted fields"
      });
    }
    
    // Process each error
    errors.forEach((error) => {
      if (!error.fieldName) return;
      
      // Find the form element by name, id, or other selectors
      const selector = `[name="${error.fieldName}"], #${error.fieldName}, [data-field="${error.fieldName}"]`;
      const element = error.element || document.querySelector(selector) as HTMLElement;
      
      if (element) {
        // Add error class
        element.classList.add('error-field');
        
        // Create ripple effect if option is enabled
        if (options.highlightWithRipple) {
          createRippleEffect(element);
        }
        
        // Add error message below the field if it doesn't exist
        const errorMessageId = `error-${error.fieldName}`;
        let errorMessage = document.getElementById(errorMessageId);
        
        if (!errorMessage) {
          errorMessage = document.createElement('div');
          errorMessage.id = errorMessageId;
          errorMessage.className = 'field-error-message';
          element.parentNode?.insertBefore(errorMessage, element.nextSibling);
        }
        
        errorMessage.textContent = error.message;
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
  };
  
  /**
   * Clear all error highlights
   */
  const clearErrorHighlights = () => {
    // Remove error classes from all fields
    document.querySelectorAll('.error-field').forEach(el => {
      el.classList.remove('error-field');
    });
    
    // Remove all error messages
    document.querySelectorAll('.field-error-message').forEach(el => {
      el.parentNode?.removeChild(el);
    });
    
    errorsRef.current = [];
  };
  
  /**
   * Enhance a form with validation highlighting
   */
  const enhanceForm = (form: any) => {
    const originalSubmit = form.handleSubmit;
    
    // Modify the submit handler to automatically validate
    form.handleSubmit = (...args: any[]) => {
      // Clear previous errors
      clearErrorHighlights();
      
      // Call the original submit method
      return originalSubmit.apply(form, args);
    };
    
    return form;
  };
  
  return {
    highlightErrors,
    clearErrorHighlights,
    enhanceForm,
    currentErrors: errorsRef.current
  };
};

/**
 * Enhance a form with validation highlighting
 */
export const enhanceFormValidation = (form: any) => {
  const validation = useFormValidation();
  return {
    ...validation,
    form
  };
};
