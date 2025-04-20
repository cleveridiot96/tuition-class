
import React from 'react';
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const FontSizeAdjuster: React.FC = () => {
  const [fontSize, setFontSize] = useLocalStorage('app-font-size', 100);
  
  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 10, 150);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
  };
  
  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 10, 70);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
  };
  
  // Apply font size on component mount
  React.useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize]);
  
  return (
    <div className="flex items-center">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={decreaseFontSize}
        className="p-1 h-8 w-8"
        title="Decrease font size"
      >
        <ZoomOut size={18} />
      </Button>
      
      <span className="text-xs mx-1">{fontSize}%</span>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={increaseFontSize}
        className="p-1 h-8 w-8"
        title="Increase font size"
      >
        <ZoomIn size={18} />
      </Button>
    </div>
  );
};

export default FontSizeAdjuster;
