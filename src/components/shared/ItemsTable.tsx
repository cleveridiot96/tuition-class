
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";
import { ItemTableProps } from './types/ItemFormTypes';

const ItemsTable: React.FC<ItemTableProps> = ({
  items,
  onItemChange,
  onRemoveItem,
  onAddItem
}) => {
  return (
    <div className="border rounded-md p-4 bg-white overflow-x-auto">
      <div className="w-full min-w-[650px]">
        <div className="grid grid-cols-12 gap-2 mb-2 font-medium">
          <div className="col-span-4">Item</div>
          <div className="col-span-2">Quantity</div>
          <div className="col-span-2">Rate</div>
          <div className="col-span-3">Amount</div>
          <div className="col-span-1"></div>
        </div>

        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 mb-2 items-end">
            <div className="col-span-4">
              <Input
                name="name"
                value={item.name}
                onChange={(e) => onItemChange(index, 'name', e.target.value)}
                placeholder="Item name"
              />
            </div>
            <div className="col-span-2">
              <Input
                name="quantity"
                type="number"
                value={item.quantity}
                onChange={(e) => onItemChange(index, 'quantity', parseFloat(e.target.value))}
                placeholder="Qty"
              />
            </div>
            <div className="col-span-2">
              <Input
                name="rate"
                type="number"
                value={item.rate}
                onChange={(e) => onItemChange(index, 'rate', parseFloat(e.target.value))}
                placeholder="Rate"
              />
            </div>
            <div className="col-span-3">
              <Input
                name="amount"
                type="number"
                value={(item.quantity * item.rate).toFixed(2)}
                disabled
              />
            </div>
            <div className="col-span-1">
              {items.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveItem(index)}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddItem}
          className="mt-2"
        >
          <Plus size={16} className="mr-2" />
          Add Item
        </Button>
      </div>
    </div>
  );
};

export default ItemsTable;
