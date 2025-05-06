
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleDot, FileDown, Trash2 } from "lucide-react";

interface FormatEventConnectorProps {
  onFormatClick: () => void;
  onExportSystemClick: () => void;
  onExportExcelClick: () => void;
}

const FormatEventConnector: React.FC<FormatEventConnectorProps> = ({ 
  onFormatClick,
  onExportSystemClick,
  onExportExcelClick 
}) => {
  return (
    <div className="flex space-x-2 mt-4">
      <Button 
        variant="destructive" 
        onClick={onFormatClick}
        className="flex items-center"
      >
        <Trash2 className="mr-2 h-4 w-4" /> Format Data
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" /> Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white">
          <DropdownMenuItem onClick={onExportSystemClick}>
            System Backup
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onExportExcelClick}>
            Excel Export
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FormatEventConnector;
