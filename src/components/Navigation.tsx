
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import FontSizeAdjuster from '@/components/UI/FontSizeAdjuster';

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
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-white shadow-sm border-b py-3 px-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {showBackButton && (
          <Button variant="ghost" size="icon" onClick={handleBack} className="mr-1">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      
      <div className="flex items-center gap-2">
        {showFormatButton && (
          <Button variant="outline" size="sm" onClick={onFormatClick}>
            Format Data
          </Button>
        )}
        <FontSizeAdjuster />
      </div>
    </div>
  );
};

export default Navigation;
