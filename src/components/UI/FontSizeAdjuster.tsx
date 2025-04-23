
import React, { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

const MIN_FONT_SIZE = 14;
const MAX_FONT_SIZE = 22;
const DEFAULT_FONT_SIZE = 16;

const FontSizeAdjuster = () => {
  const [fontSize, setFontSize] = useState(() => {
    const stored = localStorage.getItem('app-font-size');
    return stored ? parseInt(stored) : DEFAULT_FONT_SIZE;
  });
  
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem('app-font-size', fontSize.toString());
  }, [fontSize]);
  
  const handleSliderChange = (value: number[]) => {
    const newSize = value[0];
    setFontSize(newSize);
    toast.info(`Font size changed to ${newSize}px`);
  };
  
  return (
    <div className="flex items-center gap-4 w-48">
      <span className="text-white text-lg">A</span>
      <Slider
        min={MIN_FONT_SIZE}
        max={MAX_FONT_SIZE}
        step={1}
        value={[fontSize]}
        onValueChange={handleSliderChange}
        className="flex-1"
      />
      <span className="text-white text-xl">A</span>
    </div>
  );
};

export default FontSizeAdjuster;
