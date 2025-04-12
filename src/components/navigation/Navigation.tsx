
import React from "react";
import { Button } from "@/components/ui/button";
import UserMenu from "./UserMenu";
import NavigationDropdown from "./NavigationDropdown";
import FontSizeControl from "@/components/FontSizeControl";

interface NavigationProps {
  title: string;
  showBackButton?: boolean;
  showFormatButton?: boolean;
  onFormatClick?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  title, 
  showBackButton = false, 
  showFormatButton = false, 
  onFormatClick 
}) => {
  return (
    <div className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div className="max-w-full px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {showBackButton && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:size-lg android-ripple" 
              onClick={() => window.history.back()}
            >
              Back
            </Button>
          )}
          <h1 className="text-xl sm:text-2xl font-bold truncate max-w-[150px] sm:max-w-[250px] md:max-w-none">{title}</h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <FontSizeControl />
          
          {showFormatButton && (
            <Button 
              variant="outline" 
              size="sm" 
              className="md:size-lg whitespace-nowrap text-sm md:text-base android-ripple" 
              onClick={onFormatClick}
            >
              Format Data
            </Button>
          )}
          
          <NavigationDropdown />
          <UserMenu />
        </div>
      </div>
    </div>
  );
};

export default Navigation;
