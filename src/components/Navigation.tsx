
import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  title?: string;
  showBackButton?: boolean;
  className?: string;
}

const Navigation = ({ 
  title = "Kisan Khata Sahayak", 
  showBackButton = false,
  className 
}: NavigationProps) => {
  return (
    <header className={cn("bg-ag-green text-white p-4 flex items-center justify-between shadow-md", className)}>
      <div className="flex items-center">
        {showBackButton ? (
          <Button 
            variant="ghost" 
            size="icon"
            className="mr-2 text-white hover:bg-ag-green-dark"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={24} />
          </Button>
        ) : (
          <Link to="/">
            <Button 
              variant="ghost" 
              size="icon"
              className="mr-2 text-white hover:bg-ag-green-dark"
            >
              <Home size={24} />
            </Button>
          </Link>
        )}
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
    </header>
  );
};

export default Navigation;
