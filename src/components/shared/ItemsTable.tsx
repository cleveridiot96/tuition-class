
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash } from "lucide-react";

interface Item {
  id?: string;
  name: string;
  quantity: number;
  rate: number;
}

interface ItemsTableProps {
  items: Item[];
  onItemChange: (index: number, field: string, value: any) => void;
  onRemoveItem: (index: number) => void;
  onAddItem: () => void;
}

const ItemsTable: React.FC<ItemsTableProps> = ({
  items,
  onItemChange,
  onRemoveItem,
  onAddItem
}) => {
  const handleChange = (index: number, field: string, value: string) => {
    if (field === 'quantity' || field === 'rate') {
      const numericValue = value === '' ? 0 : parseFloat(value);
      onItemChange(index, field, numericValue);
    } else {
      onItemChange(index, field, value);
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Bags</th>
            <th className="text-left p-2">Rate (₹)</th>
            <th className="text-left p-2">Amount (₹)</th>
            <th className="text-left p-2 w-14"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id || index} className="border-b hover:bg-gray-50">
              <td className="p-2">
                <Input
                  value={item.name}
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                  placeholder="Item name"
                />
              </td>
              <td className="p-2">
                <Input
                  type="number"
                  value={item.quantity || ''}
                  onChange={(e) => handleChange(index, 'quantity', e.target.value)}
                  placeholder="0"
                />
              </td>
              <td className="p-2">
                <Input
                  type="number"
                  value={item.rate || ''}
                  onChange={(e) => handleChange(index, 'rate', e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                />
              </td>
              <td className="p-2">
                <Input
                  type="text"
                  value={(item.quantity * item.rate).toFixed(2)}
                  readOnly
                  className="bg-gray-100"
                />
              </td>
              <td className="p-2">
                {items.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveItem(index)}
                    className="h-8 w-8 text-red-500 hover:text-red-700"
                  >
                    <Trash size={16} />
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        onClick={onAddItem}
        className="mt-2 flex items-center"
      >
        <Plus size={16} className="mr-1" /> Add Item
      </Button>
    </div>
  );
};

export default ItemsTable;
