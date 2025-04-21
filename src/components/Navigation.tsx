
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from 'lucide-react';
import FontSizeAdjuster from './UI/FontSizeAdjuster';

interface NavigationProps {
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightContent?: React.ReactNode;
  showFormatButton?: boolean;
  onFormatClick?: () => void;
  showHomeButton?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({
  title,
  showBackButton = false,
  onBack,
  rightContent,
  showFormatButton = false,
  onFormatClick,
  showHomeButton = false
}) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };
  
  const handleHomeClick = () => {
    navigate('/');
  };
  
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-md sticky top-0 z-10 text-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          {showBackButton && (
            <Button variant="ghost" size="icon" onClick={handleBack} className="md-ripple mr-2 text-white hover:bg-white/10">
              <ArrowLeft size={18} />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={handleHomeClick} className="md-ripple mr-2 text-white hover:bg-white/10">
            <Home size={18} />
          </Button>
          {title && <h1 className="text-xl font-bold">{title}</h1>}
        </div>
        
        <div className="flex items-center space-x-4">
          <FontSizeAdjuster />
          {showFormatButton && onFormatClick && (
            <Button variant="destructive" size="sm" onClick={onFormatClick} className="md-ripple">
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
