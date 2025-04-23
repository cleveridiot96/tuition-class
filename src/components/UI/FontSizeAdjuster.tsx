
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { MinusCircle, PlusCircle } from "lucide-react";
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
    // Set the font size on the html element to affect the entire app
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem('app-font-size', fontSize.toString());
  }, [fontSize]);
  
  const increaseFontSize = () => {
    if (fontSize < MAX_FONT_SIZE) {
      const newSize = fontSize + 1;
      setFontSize(newSize);
      toast.info(`Font size increased to ${newSize}px`);
    } else {
      toast.info(`Maximum font size reached (${MAX_FONT_SIZE}px)`);
    }
  };
  
  const decreaseFontSize = () => {
    if (fontSize > MIN_FONT_SIZE) {
      const newSize = fontSize - 1;
      setFontSize(newSize);
      toast.info(`Font size decreased to ${newSize}px`);
    } else {
      toast.info(`Minimum font size reached (${MIN_FONT_SIZE}px)`);
    }
  };
  
  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        size="icon"
        onClick={decreaseFontSize}
        title="Decrease font size"
        className="text-white hover:bg-white/10"
      >
        <span className="sr-only">Decrease font size</span>
        <MinusCircle size={16} />
      </Button>
      <span className="text-white mx-1 text-xs">{fontSize}px</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={increaseFontSize}
        title="Increase font size"
        className="text-white hover:bg-white/10"
      >
        <span className="sr-only">Increase font size</span>
        <PlusCircle size={16} />
      </Button>
    </div>
  );
};

export default FontSizeAdjuster;
