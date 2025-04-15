
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Combobox } from "@/components/ui/combobox";
import { getLocations } from "@/services/storageService";

interface PurchaseItem {
  lotNumber: string;
  quantity: number;
  netWeight: number;
  rate: number;
  location: string;
  amount: number;
}

interface MultiItemPurchaseFormProps {
  onItemsChange: (items: PurchaseItem[]) => void;
  initialItems?: PurchaseItem[];
}

const MultiItemPurchaseForm = ({ onItemsChange, initialItems = [] }: MultiItemPurchaseFormProps) => {
  const [items, setItems] = useState<PurchaseItem[]>(initialItems.length > 0 ? initialItems : [getEmptyItem()]);
  const [locations, setLocations] = useState<string[]>([]);
  
  useEffect(() => {
    loadLocations();
  }, []);
  
  useEffect(() => {
    // Notify parent component when items change
    onItemsChange(items);
  }, [items, onItemsChange]);
  
  const loadLocations = () => {
    const savedLocations = getLocations();
    if (savedLocations && savedLocations.length > 0) {
      setLocations(savedLocations);
    } else {
      // Default locations if none are saved
      setLocations(["Mumbai", "Chiplun", "Sawantwadi"]);
    }
  };
  
  function getEmptyItem(): PurchaseItem {
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
  
  const handleItemChange = (index: number, field: keyof PurchaseItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Update the amount field if quantity, netWeight or rate changes
    if (field === 'quantity' || field === 'netWeight' || field === 'rate') {
      const item = newItems[index];
      newItems[index].amount = item.netWeight * item.rate;
    }
    
    setItems(newItems);
  };
  
  // Calculate the total amount
  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

  // Generate a unique lot number suggestion
  const generateLotNumberSuggestion = (index: number) => {
    const now = new Date();
    const prefix = now.getFullYear().toString().substring(2) + 
                  (now.getMonth() + 1).toString().padStart(2, '0') + 
                  now.getDate().toString().padStart(2, '0');
    return `${prefix}-${index + 1}`;
  };
  
  // Auto-fill empty lot numbers
  useEffect(() => {
    const newItems = [...items];
    let changed = false;
    
    newItems.forEach((item, index) => {
      if (!item.lotNumber) {
        newItems[index].lotNumber = generateLotNumberSuggestion(index);
        changed = true;
      }
    });
    
    if (changed) {
      setItems(newItems);
    }
  }, [items.length]);
  
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
                  <Input
                    value={item.lotNumber}
                    onChange={(e) => handleItemChange(index, 'lotNumber', e.target.value)}
                    placeholder="Enter lot number"
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
                <TableCell>
                  <Combobox
                    options={locations.map(location => ({
                      value: location,
                      label: location
                    }))}
                    value={item.location}
                    onSelect={(value) => handleItemChange(index, 'location', value)}
                    placeholder="Select location"
                    className="max-w-[150px]"
                  />
                </TableCell>
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

export default MultiItemPurchaseForm;
