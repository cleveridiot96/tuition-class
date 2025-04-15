
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { getInventory } from "@/services/storageService";

interface SalesItem {
  lotNumber: string;
  quantity: number;
  netWeight: number;
  rate: number;
  location: string;
  amount: number;
}

interface MultiItemSalesFormProps {
  onItemsChange: (items: SalesItem[]) => void;
  initialItems?: SalesItem[];
}

const MultiItemSalesForm = ({ onItemsChange, initialItems = [] }: MultiItemSalesFormProps) => {
  const [items, setItems] = useState<SalesItem[]>(initialItems.length > 0 ? initialItems : [getEmptyItem()]);
  const [inventory, setInventory] = useState<any[]>([]);
  
  useEffect(() => {
    loadInventory();
  }, []);
  
  useEffect(() => {
    // Notify parent component when items change
    onItemsChange(items);
  }, [items, onItemsChange]);
  
  const loadInventory = () => {
    const inventoryItems = getInventory() || [];
    // Only show items that are not deleted and have quantity
    const availableItems = inventoryItems.filter(item => 
      !item.isDeleted && 
      ((item.remainingQuantity !== undefined ? item.remainingQuantity : item.quantity) > 0)
    );
    setInventory(availableItems);
  };
  
  function getEmptyItem(): SalesItem {
    return {
      lotNumber: "",
      quantity: 0,
      netWeight: 0,
      rate: 0,
      location: "",
      amount: 0
    };
  }
  
  const handleAddItem = () => {
    setItems([...items, getEmptyItem()]);
  };
  
  const handleRemoveItem = (index: number) => {
    if (items.length === 1) {
      toast.error("You must have at least one item");
      return;
    }
    
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };
  
  const handleItemChange = (index: number, field: keyof SalesItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Update the amount field if quantity, netWeight or rate changes
    if (field === 'quantity' || field === 'netWeight' || field === 'rate') {
      const item = newItems[index];
      newItems[index].amount = item.netWeight * item.rate;
    }
    
    // If lotNumber changes, update location from inventory
    if (field === 'lotNumber') {
      const inventoryItem = inventory.find(item => item.lotNumber === value);
      if (inventoryItem) {
        newItems[index].location = inventoryItem.location || '';
        
        // Pre-fill net weight and quantity based on inventory
        if (newItems[index].quantity === 0) {
          const availableQuantity = inventoryItem.remainingQuantity !== undefined ? 
            inventoryItem.remainingQuantity : inventoryItem.quantity;
          newItems[index].quantity = availableQuantity;
        }
        
        if (newItems[index].netWeight === 0 && inventoryItem.netWeight) {
          // Calculate net weight proportionally based on the quantity
          const inventoryNetWeight = inventoryItem.netWeight;
          const inventoryQuantity = inventoryItem.quantity;
          if (inventoryQuantity > 0) {
            const proportionalWeight = (newItems[index].quantity / inventoryQuantity) * inventoryNetWeight;
            newItems[index].netWeight = proportionalWeight;
          }
        }
      }
    }
    
    setItems(newItems);
  };
  
  // Calculate the total amount
  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
  
  return (
    <Card className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Items</h3>
        <Button onClick={handleAddItem} size="sm" className="flex items-center gap-1">
          <Plus size={16} /> Add Item
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lot Number</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Net Weight (kg)</TableHead>
              <TableHead>Rate (₹)</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Amount (₹)</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Combobox
                    options={inventory.map(item => ({
                      value: item.lotNumber,
                      label: `${item.lotNumber} (${item.remainingQuantity !== undefined ? item.remainingQuantity : item.quantity} bags)`
                    }))}
                    value={item.lotNumber}
                    onSelect={(value) => handleItemChange(index, 'lotNumber', value)}
                    placeholder="Select lot"
                    className="max-w-[150px]"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                    className="w-20"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.netWeight}
                    onChange={(e) => handleItemChange(index, 'netWeight', Number(e.target.value))}
                    className="w-24"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.rate}
                    onChange={(e) => handleItemChange(index, 'rate', Number(e.target.value))}
                    className="w-24"
                  />
                </TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell className="font-medium">₹{item.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(index)}
                    disabled={items.length === 1}
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={5} className="text-right font-semibold">
                Total Amount:
              </TableCell>
              <TableCell className="font-bold">₹{totalAmount.toFixed(2)}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default MultiItemSalesForm;
