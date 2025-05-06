
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { InventoryItem } from "@/services/types";

export interface InventoryCardProps {
  item: InventoryItem;
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
}

export const InventoryCard = ({ item, onEdit, onDelete }: InventoryCardProps) => (
  <Card className="p-4">
    <div className="flex justify-between items-center border-b pb-2 mb-2">
      <h3 className="text-xl font-bold">{item.lotNumber}</h3>
      <span className={`px-3 py-1 rounded-full text-white ${
        item.location === "Chiplun" ? "bg-ag-green" : "bg-ag-orange"
      }`}>
        {item.location}
      </span>
    </div>
    <div className="mt-2">
      <p className="text-2xl font-bold">{item.quantity} bags</p>
      <p className="text-ag-brown text-sm mt-1">
        Added on: {new Date(item.dateAdded).toLocaleDateString()}
      </p>
      <p className="text-ag-brown text-sm">Net Weight: {item.netWeight} Kg</p>
    </div>
    <div className="mt-4 flex space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex-1 flex items-center justify-center"
        onClick={() => onEdit(item)}
      >
        <Edit size={16} className="mr-1" /> Edit
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex-1 flex items-center justify-center text-red-500 hover:text-red-700"
        onClick={() => onDelete(item.id)}
      >
        <Trash2 size={16} className="mr-1" /> Delete
      </Button>
    </div>
  </Card>
);

export default InventoryCard;
