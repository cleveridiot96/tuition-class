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
import { useState } from "react";

interface NavigationProps {
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightContent?: React.ReactNode;
  showFormatButton?: boolean;
  onFormatClick?: () => void;
  showHomeButton?: boolean;
  className?: string; // Custom className for styling
}

const Navigation: React.FC<NavigationProps> = ({
  title,
  showBackButton = false,
  onBack,
  rightContent,
  showFormatButton = false,
  onFormatClick,
  showHomeButton = true,
  className = ''
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [formatPassword, setFormatPassword] = useState("");
  
  // Route-based styles - default to blue gradient
  const getRouteBasedStyles = () => {
    const path = location.pathname;
    if (path.includes('/purchases')) return 'bg-gradient-to-r from-blue-600 to-blue-800';
    if (path.includes('/sales')) return 'bg-gradient-to-r from-purple-600 to-purple-800';
    if (path.includes('/stock') || path.includes('/inventory')) return 'bg-gradient-to-r from-green-600 to-green-800';
    if (path.includes('/party-ledger')) return 'bg-gradient-to-r from-amber-600 to-amber-800';
    // Use default blue for dashboard or any other route
    return 'bg-gradient-to-r from-blue-600 to-purple-600';
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
  
  // Combine route-based styles with custom class + sticky positioning
  const headerClasses = `sticky top-0 z-50 w-full shadow-md ${getRouteBasedStyles()} ${className}`;
  
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
