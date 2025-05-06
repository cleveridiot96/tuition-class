
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Master } from "@/types/master.types";

interface MasterCardProps {
  master: Master;
  onEdit: (master: Master) => void;
  onDelete: (master: Master) => void;
}

const MasterCard = ({ master, onEdit, onDelete }: MasterCardProps) => {
  return (
    <Card className="p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-indigo-800">{master.name}</h3>
            {master.type && (
              <p className="text-xs text-gray-500 capitalize">
                Type: {master.type}
              </p>
            )}
            {(master.type === "broker" || master.type === "agent") && 
              master.commissionRate !== undefined && (
              <p className="text-sm text-gray-700 mt-1">
                Commission Rate: {master.commissionRate}%
              </p>
            )}
          </div>
          <div className="flex space-x-1">
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0" 
              onClick={() => onEdit(master)}
            >
              <Pencil className="h-4 w-4 text-blue-600" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0" 
              onClick={() => onDelete(master)}
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MasterCard;
