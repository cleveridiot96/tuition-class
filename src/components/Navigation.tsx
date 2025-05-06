
import React from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Menu } from 'lucide-react';
import FontSizeAdjuster from './UI/FontSizeAdjuster';
import { exportDataBackup, exportToExcel } from '@/services/storageUtils';
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { menuItems } from './DashboardMenu';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

// Define consistent colors for pages that match dashboard tile colors
const PAGE_COLORS = {
  purchases: 'bg-gradient-to-r from-purple-600 to-purple-800',
  sales: 'bg-gradient-to-r from-indigo-600 to-indigo-800',
  inventory: 'bg-gradient-to-r from-cyan-600 to-cyan-800',
  stock: 'bg-gradient-to-r from-orange-600 to-orange-800',
  locationTransfer: 'bg-gradient-to-r from-violet-600 to-violet-800',
  payments: 'bg-gradient-to-r from-red-600 to-red-800',
  receipts: 'bg-gradient-to-r from-lime-600 to-lime-800',
  master: 'bg-gradient-to-r from-blue-600 to-blue-800',
  cashBook: 'bg-gradient-to-r from-pink-600 to-pink-800',
  ledger: 'bg-gradient-to-r from-gray-600 to-gray-800',
  default: 'bg-gradient-to-r from-blue-600 to-purple-600',
};

interface NavigationProps {
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightContent?: React.ReactNode;
  showFormatButton?: boolean;
  onFormatClick?: () => void;
  showHomeButton?: boolean;
  className?: string; // Custom className for styling
  pageType?: string; // Added pageType prop
}

const Navigation: React.FC<NavigationProps> = ({
  title,
  showBackButton = false,
  onBack,
  rightContent,
  showFormatButton = false,
  onFormatClick,
  showHomeButton = true,
  className = '',
  pageType,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [formatPassword, setFormatPassword] = useState("");
  const [currentPageType, setCurrentPageType] = useState<string>('default');
  
  // On mount, get the page type from localStorage or from props
  useEffect(() => {
    const storedPageType = localStorage.getItem('currentPageType');
    if (pageType) {
      setCurrentPageType(pageType);
    } else if (storedPageType) {
      setCurrentPageType(storedPageType);
    } else {
      // Determine page type from route
      const path = location.pathname;
      if (path.includes('/purchases')) setCurrentPageType('purchases');
      else if (path.includes('/sales')) setCurrentPageType('sales');
      else if (path.includes('/inventory')) setCurrentPageType('inventory');
      else if (path.includes('/stock')) setCurrentPageType('stock');
      else if (path.includes('/location-transfer')) setCurrentPageType('locationTransfer');
      else if (path.includes('/payments')) setCurrentPageType('payments');
      else if (path.includes('/receipts')) setCurrentPageType('receipts');
      else if (path.includes('/master')) setCurrentPageType('master');
      else if (path.includes('/cash-book')) setCurrentPageType('cashBook');
      else if (path.includes('/ledger')) setCurrentPageType('ledger');
      else setCurrentPageType('default');
    }
  }, [location.pathname, pageType]);
  
  // Get page color based on the current page type
  const getPageColor = () => {
    return PAGE_COLORS[currentPageType as keyof typeof PAGE_COLORS] || PAGE_COLORS.default;
  };
  
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
  
  // Direct handling of format button click
  const handleFormatButtonClick = () => {
    setIsPasswordDialogOpen(true);
  };
  
  // Handle password submission
  const handlePasswordSubmit = () => {
    setIsPasswordDialogOpen(false);
    
    // If onFormatClick is provided, call it with the password
    if (onFormatClick) {
      onFormatClick();
    }
  };
  
  // Combine page-based styles with custom class + sticky positioning
  const headerClasses = `sticky top-0 z-50 w-full shadow-md ${getPageColor()} ${className}`;
  
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
                <div className={`p-4 ${getPageColor()} text-white`}>
                  <h2 className="text-xl font-bold">Kirana Retail</h2>
                </div>
                <div className="p-0">
                  <ul className="divide-y">
                    {menuItems.map((item) => (
                      <li key={item.title}>
                        <Button 
                          variant="ghost" 
                          className="w-full flex justify-start items-center p-4 rounded-none hover:bg-gray-100 text-gray-700"
                          onClick={() => {
                            localStorage.setItem('currentPageType', item.type);
                            navigate(item.path);
                          }}
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
            {showFormatButton && (
              <Button variant="destructive" size="sm" onClick={handleFormatButtonClick} className="md-ripple">
                Format
              </Button>
            )}
            {rightContent}
          </div>
        </div>
      </div>

      {/* Password Protection Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Format Protection</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="formatPassword">Enter Format Password</Label>
            <Input 
              id="formatPassword" 
              type="password" 
              placeholder="Password"
              value={formatPassword}
              onChange={(e) => setFormatPassword(e.target.value)}
              className="mt-2"
              autoComplete="off"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePasswordSubmit}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Navigation;
