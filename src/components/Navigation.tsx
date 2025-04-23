
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Menu } from 'lucide-react';
import FontSizeAdjuster from './UI/FontSizeAdjuster';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import DashboardMenu from './DashboardMenu';

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
  showHomeButton = true // Changed default to true so home button always shows
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
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md-ripple mr-2 text-white hover:bg-white/10">
                <Menu size={18} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <h2 className="text-xl font-bold">Kirana Retail</h2>
              </div>
              <div className="p-4">
                <DashboardMenu />
              </div>
            </SheetContent>
          </Sheet>
          
          {showBackButton && (
            <Button variant="ghost" size="icon" onClick={handleBack} className="md-ripple mr-2 text-white hover:bg-white/10">
              <ArrowLeft size={18} />
            </Button>
          )}
          
          {/* Always show home button */}
          {showHomeButton && (
            <Button variant="ghost" size="icon" onClick={handleHomeClick} className="md-ripple mr-2 text-white hover:bg-white/10">
              <Home size={18} />
            </Button>
          )}
          
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
