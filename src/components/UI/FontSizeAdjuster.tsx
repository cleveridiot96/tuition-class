
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const FontSizeAdjuster = () => {
  const [fontSize, setFontSize] = useState(16); // Default font size
  
  useEffect(() => {
    // Load saved font size from localStorage on component mount
    const savedFontSize = localStorage.getItem('appFontSize');
    if (savedFontSize) {
      const parsedSize = parseInt(savedFontSize);
      setFontSize(parsedSize);
      document.documentElement.style.fontSize = `${parsedSize}px`;
    }
  }, []);
  
  const changeFontSize = (delta: number) => {
    const newSize = Math.min(Math.max(fontSize + delta, 12), 24); // Limit between 12px and 24px
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}px`;
    localStorage.setItem('appFontSize', newSize.toString());
  };
  
  return (
    <div className="flex items-center gap-1 bg-white/10 rounded-md p-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => changeFontSize(-1)}
              className="px-2 py-1 h-7 min-w-[28px] text-white hover:bg-white/20"
            >
              A-
            </Button>
          </TooltipTrigger>
          <TooltipContent>Decrease font size</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => changeFontSize(1)}
              className="px-2 py-1 h-7 min-w-[28px] text-white hover:bg-white/20"
            >
              A+
            </Button>
          </TooltipTrigger>
          <TooltipContent>Increase font size</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default FontSizeAdjuster;
