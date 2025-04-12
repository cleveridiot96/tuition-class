
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { TextSize, ZoomIn, ZoomOut } from 'lucide-react';

const FontSizeControl: React.FC = () => {
  const [fontSize, setFontSize] = useState<string>(
    localStorage.getItem('app-font-size') || 'normal'
  );

  // Apply font size when component mounts or fontSize changes
  useEffect(() => {
    const htmlElement = document.documentElement;
    
    // Remove any existing font size classes
    htmlElement.classList.remove(
      'font-size-small',
      'font-size-normal',
      'font-size-large', 
      'font-size-xlarge'
    );
    
    // Add the current font size class
    htmlElement.classList.add(`font-size-${fontSize}`);
    
    // Save to localStorage
    localStorage.setItem('app-font-size', fontSize);
  }, [fontSize]);

  const increaseFontSize = () => {
    setFontSize(current => {
      switch (current) {
        case 'small': return 'normal';
        case 'normal': return 'large';
        case 'large': return 'xlarge';
        default: return 'xlarge';
      }
    });
  };

  const decreaseFontSize = () => {
    setFontSize(current => {
      switch (current) {
        case 'xlarge': return 'large';
        case 'large': return 'normal';
        case 'normal': return 'small';
        default: return 'small';
      }
    });
  };

  const resetFontSize = () => {
    setFontSize('normal');
  };

  return (
    <div className="flex items-center gap-1">
      <Button 
        variant="outline"
        size="icon"
        onClick={decreaseFontSize}
        className="android-ripple"
        title="Decrease font size"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={resetFontSize}
        className="android-ripple"
        title="Reset font size"
      >
        <TextSize className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={increaseFontSize}
        className="android-ripple"
        title="Increase font size"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default FontSizeControl;
