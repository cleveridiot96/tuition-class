
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const FontSizeAdjuster = () => {
  const [currentSize, setCurrentSize] = useState<string>("normal");
  
  useEffect(() => {
    // Load user's font size preference from localStorage
    const savedSize = localStorage.getItem("font-size-preference") || "normal";
    setCurrentSize(savedSize);
    applyFontSize(savedSize);
    
    // Apply the CSS on load
    const style = document.createElement('style');
    style.innerHTML = `
      .font-size-small { font-size: 0.85rem !important; }
      .font-size-normal { font-size: 1rem !important; }
      .font-size-large { font-size: 1.15rem !important; }
      .font-size-x-large { font-size: 1.3rem !important; }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  const applyFontSize = (size: string) => {
    // Remove all font size classes
    document.body.classList.remove(
      "font-size-small",
      "font-size-normal", 
      "font-size-large",
      "font-size-x-large"
    );
    
    // Add the selected font size class
    document.body.classList.add(`font-size-${size}`);
    
    // Save preference to localStorage
    localStorage.setItem("font-size-preference", size);
    setCurrentSize(size);
  };
  
  const decreaseSize = () => {
    switch (currentSize) {
      case "normal":
        applyFontSize("small");
        break;
      case "large":
        applyFontSize("normal");
        break;
      case "x-large":
        applyFontSize("large");
        break;
      default:
        break;
    }
  };
  
  const increaseSize = () => {
    switch (currentSize) {
      case "small":
        applyFontSize("normal");
        break;
      case "normal":
        applyFontSize("large");
        break;
      case "large":
        applyFontSize("x-large");
        break;
      default:
        break;
    }
  };
  
  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={decreaseSize}
        disabled={currentSize === "small"}
        className="text-white hover:bg-white/10 font-semibold"
      >
        A-
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={increaseSize}
        disabled={currentSize === "x-large"}
        className="text-white hover:bg-white/10 font-semibold"
      >
        A+
      </Button>
    </div>
  );
};

export default FontSizeAdjuster;
