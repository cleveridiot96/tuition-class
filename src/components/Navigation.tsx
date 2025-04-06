
import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, Info, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavigationProps {
  title?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  showFormatButton?: boolean;
  onFormatClick?: () => void;
  className?: string;
}

const Navigation = ({ 
  title = "Business Management", 
  showBackButton = false,
  showHomeButton = true,
  showFormatButton = false,
  onFormatClick,
  className 
}: NavigationProps) => {
  return (
    <TooltipProvider>
      <header className={cn("bg-ag-green text-white p-4 flex items-center justify-between shadow-md", className)}>
        <div className="flex items-center">
          {showBackButton && (
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="mr-2 text-white hover:bg-ag-green-dark"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft size={24} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Go back</p>
              </TooltipContent>
            </Tooltip>
          )}
          
          {/* Always show home button unless explicitly disabled */}
          {showHomeButton && (
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Link to="/">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="mr-2 text-white hover:bg-ag-green-dark"
                  >
                    <Home size={24} />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Return to dashboard</p>
              </TooltipContent>
            </Tooltip>
          )}
          
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>

        {showFormatButton && (
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-ag-green-dark"
                onClick={onFormatClick}
              >
                <RefreshCw size={24} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Format data</p>
            </TooltipContent>
          </Tooltip>
        )}
      </header>
    </TooltipProvider>
  );
};

export default Navigation;
