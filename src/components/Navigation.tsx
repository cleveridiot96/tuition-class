
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import FontSizeAdjuster from './UI/FontSizeAdjuster';

interface NavigationProps {
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightContent?: React.ReactNode;
  showFormatButton?: boolean;
  onFormatClick?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  title,
  showBackButton = false,
  onBack,
  rightContent,
  showFormatButton = false,
  onFormatClick
}) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };
  
  return (
    <div className="bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          {showBackButton && (
            <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
              <ArrowLeft size={18} />
            </Button>
          )}
          {title && <h1 className="text-xl font-bold">{title}</h1>}
        </div>
        
        <div className="flex items-center space-x-4">
          <FontSizeAdjuster />
          {showFormatButton && onFormatClick && (
            <Button variant="ghost" size="sm" onClick={onFormatClick}>
              Format
            </Button>
          )}
          {rightContent}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
