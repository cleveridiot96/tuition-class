
import React, { useEffect } from 'react';

// Component that adds ripple effect to buttons and other interactive elements
const RippleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Function to add ripple effect
    const addRippleEffect = () => {
      // Get all interactive elements that should have ripple effect
      const elements = document.querySelectorAll('button, .card, [role="button"], .clickable, a');
      
      // Add ripple class to elements
      elements.forEach(element => {
        if (element instanceof HTMLElement && !element.classList.contains('ripple') && !element.classList.contains('no-ripple')) {
          element.classList.add('ripple');
          element.classList.add('md-ripple');
          element.classList.add('btn-click');
        }
      });
      
      // Add ripple effect to any new elements that get added to the DOM
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.addedNodes.length) {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === 1) { // Element node
                const element = node as Element;
                if (
                  (element.tagName === 'BUTTON' || 
                   element.tagName === 'A' || 
                   element.getAttribute('role') === 'button' ||
                   element.classList.contains('clickable') ||
                   element.classList.contains('card')) && 
                  !element.classList.contains('ripple') &&
                  !element.classList.contains('no-ripple')
                ) {
                  element.classList.add('ripple');
                  element.classList.add('md-ripple');
                  element.classList.add('btn-click');
                }
                
                // Also check children of this node
                const childInteractiveElements = element.querySelectorAll('button, .card, [role="button"], .clickable, a');
                childInteractiveElements.forEach(el => {
                  if (!el.classList.contains('ripple') && !el.classList.contains('no-ripple')) {
                    el.classList.add('ripple');
                    el.classList.add('md-ripple');
                    el.classList.add('btn-click');
                  }
                });
              }
            });
          }
        });
      });
      
      // Observe changes to the DOM
      observer.observe(document.body, { childList: true, subtree: true });
      
      return () => {
        observer.disconnect();
      };
    };
    
    // Add ripple effect
    const cleanup = addRippleEffect();
    
    return cleanup;
  }, []);
  
  return <>{children}</>;
};

export default RippleProvider;
