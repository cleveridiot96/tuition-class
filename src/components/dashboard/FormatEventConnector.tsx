
import React, { useEffect } from 'react';

interface FormatEventConnectorProps {
  onFormatClick: () => void;
}

/**
 * A component that listens for format click events and triggers the format handler
 * This provides a bridge between the Navigation component (which we can't modify)
 * and our FormatDataHandler component
 */
const FormatEventConnector = ({ onFormatClick }: FormatEventConnectorProps) => {
  useEffect(() => {
    const handleFormatClick = () => {
      onFormatClick();
    };

    document.addEventListener('format-click', handleFormatClick);
    
    return () => {
      document.removeEventListener('format-click', handleFormatClick);
    };
  }, [onFormatClick]);

  return null;
};

export default FormatEventConnector;
