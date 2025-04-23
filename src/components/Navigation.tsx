import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Menu } from 'lucide-react';
import FontSizeAdjuster from './UI/FontSizeAdjuster';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { menuItems } from './DashboardMenu';

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
  showHomeButton = true
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
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
  
  const headerClasses = "sticky top-0 z-10 w-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-md";
  
  return (
    <div className={headerClasses}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
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
                <div className="p-0">
                  {/* iOS style list menu with icons */}
                  <ul className="divide-y">
                    {menuItems.map((item) => (
                      <li key={item.title}>
                        <Button 
                          variant="ghost" 
                          className="w-full flex justify-start items-center p-4 rounded-none hover:bg-gray-100 text-gray-700"
                          onClick={() => navigate(item.path)}
                        >
                          <item.icon size={20} className="mr-4 text-blue-600" />
                          <span className="text-base">{item.title}</span>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              </SheetContent>
            </Sheet>
            
            {showBackButton && (
              <Button variant="ghost" size="icon" onClick={handleBack} className="md-ripple text-white hover:bg-white/10">
                <ArrowLeft size={18} />
              </Button>
            )}
            
            {showHomeButton && (
              <Button variant="ghost" size="icon" onClick={handleHomeClick} className="md-ripple text-white hover:bg-white/10">
                <Home size={18} />
              </Button>
            )}
            
            {title && <h1 className="text-xl font-bold text-white">{title}</h1>}
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
    </div>
  );
};

export default Navigation;
