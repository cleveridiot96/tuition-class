
import { useCallback, useRef } from 'react';
import { toast } from 'sonner';

export interface FormFieldError {
  fieldName: string;
  message: string;
}

export interface ValidationOptions {
  scrollToError?: boolean;
  highlightWithRipple?: boolean;
  showToast?: boolean;
}

/**
 * Custom hook for form validation with ripple effect for highlighting errors
 */
export const useFormValidation = () => {
  const activeHighlights = useRef<HTMLElement[]>([]);
  
  /**
   * Creates a ripple effect on an element
   */
  const createRippleEffect = useCallback((element: HTMLElement) => {
    // Remove any existing ripple elements
    const existingRipples = element.querySelectorAll('.validation-ripple');
    existingRipples.forEach(ripple => {
      if (ripple.parentNode === element) {
        element.removeChild(ripple);
      }
    });
    
    // Create the ripple element
    const ripple = document.createElement('span');
    ripple.className = 'validation-ripple';
    element.appendChild(ripple);
    
    // Apply ripple styles
    const style = ripple.style;
    style.position = 'absolute';
    style.borderRadius = '50%';
    style.backgroundColor = 'rgba(255, 82, 82, 0.4)';
    style.width = '120%';
    style.height = '120%';
    style.left = '-10%';
    style.top = '-10%';
    style.opacity = '0';
    style.pointerEvents = 'none';
    style.zIndex = '10';
    
    // Set element to relative position if not already positioned
    if (getComputedStyle(element).position === 'static') {
      element.style.position = 'relative';
    }
    
    // Add the element to active highlights
    activeHighlights.current.push(element);
    
    // Create and run the animation
    const animation = ripple.animate(
      [
        { opacity: 0, transform: 'scale(0.3)' },
        { opacity: 1, transform: 'scale(0.8)' },
        { opacity: 0, transform: 'scale(1)' }
      ],
      {
        duration: 800,
        iterations: 2
      }
    );
    
    // Clean up after animation completes
    animation.onfinish = () => {
      if (ripple.parentNode === element) {
        element.removeChild(ripple);
      }
    };
    
    // Add error styles to the input
    element.classList.add('validation-error');
    
    // Return cleanup function
    return () => {
      if (ripple.parentNode === element) {
        ripple.remove();
      }
      element.classList.remove('validation-error');
    };
  }, []);
  
  /**
   * Clear all error highlights
   */
  const clearErrorHighlights = useCallback(() => {
    // Remove highlight from all active elements
    activeHighlights.current.forEach(element => {
      element.classList.remove('validation-error');
      
      // Remove any ripple elements
      const ripples = element.querySelectorAll('.validation-ripple');
      ripples.forEach(ripple => {
        if (ripple.parentNode === element) {
          element.removeChild(ripple);
        }
      });
    });
    
    // Clear the active highlights array
    activeHighlights.current = [];
  }, []);
  
  /**
   * Find form field element by name
   */
  const findFieldElement = useCallback((fieldName: string): HTMLElement | null => {
    // Try different selectors to find the field
    const selectors = [
      `input[name="${fieldName}"]`,
      `select[name="${fieldName}"]`,
      `textarea[name="${fieldName}"]`,
      `[data-field="${fieldName}"]`,
      `#${fieldName}`,
      `.${fieldName}-field`,
    ];
    
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element instanceof HTMLElement) {
        return element;
      }
    }
    
    // If above selectors don't work, try looking for the element inside a form control
    const formItem = document.querySelector(`[data-field-name="${fieldName}"]`);
    if (formItem instanceof HTMLElement) {
      const input = formItem.querySelector('input, select, textarea');
      if (input instanceof HTMLElement) {
        return input;
      }
      return formItem;
    }
    
    return null;
  }, []);
  
  /**
   * Highlight form field errors
   */
  const highlightErrors = useCallback((errors: FormFieldError[], options: ValidationOptions = {}) => {
    if (!errors || errors.length === 0) return;
    
    // Add validation styles to the document if they don't exist
    if (!document.getElementById('form-validation-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'form-validation-styles';
      styleEl.textContent = `
        .validation-error {
          border: 2px solid #ff5252 !important;
          box-shadow: 0 0 0 2px rgba(255, 82, 82, 0.25);
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
        
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 70% { transform: translate3d(-2px, 0, 0); }
          40%, 60% { transform: translate3d(2px, 0, 0); }
        }
      `;
      document.head.appendChild(styleEl);
    }
    
    // Clear previous highlights
    clearErrorHighlights();
    
    // If we should show a toast and there are errors, show the first error
    if (options.showToast && errors.length > 0) {
      toast.error(`Form validation failed: ${errors[0].message}`);
    }
    
    // Process each error
    errors.forEach(error => {
      if (!error.fieldName) return;
      
      // Find the element
      const element = findFieldElement(error.fieldName);
      
      if (element) {
        // Add to active highlights
        activeHighlights.current.push(element);
        
        // Add error class
        element.classList.add('validation-error');
        
        // Apply ripple effect if option is enabled
        if (options.highlightWithRipple) {
          createRippleEffect(element);
        }
      }
    });
    
    // Scroll to the first error if option is enabled
    if (options.scrollToError && errors.length > 0) {
      const firstErrorElement = findFieldElement(errors[0].fieldName);
      
      if (firstErrorElement) {
        setTimeout(() => {
          firstErrorElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
          
          // Focus the element after scrolling
          setTimeout(() => {
            firstErrorElement.focus();
          }, 300);
        }, 100);
      }
    }
  }, [clearErrorHighlights, createRippleEffect, findFieldElement]);
  
  /**
   * Enhance an existing form with validation functionality
   */
  const enhanceFormValidation = useCallback((form: any) => {
    if (!form) return null;
    
    return {
      validateFields: (fieldNames: string[]) => {
        const errors: FormFieldError[] = [];
        
        fieldNames.forEach(fieldName => {
          const fieldError = form.formState.errors[fieldName];
          if (fieldError) {
            errors.push({
              fieldName,
              message: fieldError.message as string || `Invalid ${fieldName}`
            });
          }
        });
        
        if (errors.length > 0) {
          highlightErrors(errors, {
            scrollToError: true,
            highlightWithRipple: true
          });
        }
        
        return errors.length === 0;
      },
      
      clearFieldError: (fieldName: string) => {
        form.clearErrors(fieldName);
        const element = findFieldElement(fieldName);
        if (element) {
          element.classList.remove('validation-error');
        }
      },
      
      validateForm: () => {
        return form.trigger();
      },
      
      highlightErrors,
      clearErrorHighlights,
      form
    };
  }, [highlightErrors, clearErrorHighlights, findFieldElement]);
  
  return {
    highlightErrors,
    clearErrorHighlights,
    enhanceFormValidation,
    findFieldElement
  };
};

/**
 * Enhance form validation for react-hook-form and other form libraries
 */
export const enhanceFormValidation = (form: any) => {
  // Return enhanced form if useFormValidation is not available
  if (!form) return null;
  
  const validation = useFormValidation();
  return validation.enhanceFormValidation(form);
};
