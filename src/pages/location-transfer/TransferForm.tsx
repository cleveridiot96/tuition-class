
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { getInventory, updateInventoryAfterTransfer } from "@/services/storageService";
import { getStorageItem } from '@/services/core/storageCore';

export interface TransferFormProps {
  onTransferComplete: () => void;
  onSubmit?: () => void;
}

const TransferForm: React.FC<TransferFormProps> = ({ onTransferComplete, onSubmit }) => {
  const [items, setItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [fromLocation, setFromLocation] = useState<string>("");
  const [toLocation, setToLocation] = useState<string>("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [date, setDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [locations, setLocations] = useState<string[]>([]);
  const [availableQuantity, setAvailableQuantity] = useState<number>(0);
  const [bags, setBags] = useState<number>(0);
  const [weightPerBag, setWeightPerBag] = useState<number>(50);
  const [isManualWeight, setIsManualWeight] = useState<boolean>(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);

    const inventory = getInventory();
    setItems(inventory.filter(item => !item.isSoldOut && item.remainingQuantity > 0));

    const locationList = getStorageItem<string[]>('locations') || [];
    setLocations(locationList.length > 0 ? locationList : ["Mumbai", "Sawantwadi", "Chiplun"]);
  }, []);

  useEffect(() => {
    if (selectedItem && fromLocation) {
      const item = items.find(i => i.id === selectedItem);
      if (item) {
        if (item.locationQuantities && item.locationQuantities[fromLocation]) {
          setAvailableQuantity(item.locationQuantities[fromLocation]);
        } else {
          setAvailableQuantity(item.remainingQuantity || 0);
        }
      } else {
        setAvailableQuantity(0);
      }
    } else {
      setAvailableQuantity(0);
    }
  }, [selectedItem, fromLocation, items]);

  // Calculate weight based on bags
  useEffect(() => {
    if (!isManualWeight) {
      const calculatedWeight = bags * weightPerBag;
      setQuantity(calculatedWeight);
    }
  }, [bags, weightPerBag, isManualWeight]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedItem) {
      toast.error("Please select an item to transfer");
      return;
    }
    if (!fromLocation) {
      toast.error("Please select a source location");
      return;
    }
    if (!toLocation) {
      toast.error("Please select a destination location");
      return;
    }
    if (fromLocation === toLocation) {
      toast.error("Source and destination locations cannot be the same");
      return;
    }
    if (!quantity || quantity <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }
    if (quantity > availableQuantity) {
      toast.error(`Cannot transfer more than available quantity (${availableQuantity})`);
      return;
    }

    const itemToTransfer = items.find(i => i.id === selectedItem);
    if (!itemToTransfer) {
      toast.error("Selected item not found");
      return;
    }

    const updatedInventory = items.map(item => {
      if (item.id === selectedItem) {
        const locationQuantities = item.locationQuantities || {};
        
        const sourceQty = locationQuantities[fromLocation] || item.remainingQuantity;
        const updatedSourceQty = sourceQty - Number(quantity);
        
        const destQty = locationQuantities[toLocation] || 0;
        const updatedDestQty = destQty + Number(quantity);
        
        return {
          ...item,
          locationQuantities: {
            ...locationQuantities,
            [fromLocation]: updatedSourceQty,
            [toLocation]: updatedDestQty
          }
        };
      }
      return item;
    });

    try {
      updateInventoryAfterTransfer(updatedInventory);
      
      const transferRecord = {
        id: Date.now().toString(),
        date,
        itemId: selectedItem,
        itemName: itemToTransfer.lotNumber || "Unknown",
        fromLocation,
        toLocation,
        quantity: Number(quantity),
        bags,
        notes,
        timestamp: new Date().toISOString()
      };
      
      const existingTransfers = getStorageItem<any[]>('locationTransfers') || [];
      const updatedTransfers = [...existingTransfers, transferRecord];
      
      localStorage.setItem('locationTransfers', JSON.stringify(updatedTransfers));
      
      toast.success("Inventory transfer completed successfully");
      
      setSelectedItem("");
      setFromLocation("");
      setToLocation("");
      setQuantity("");
      setBags(0);
      setIsManualWeight(false);
      setNotes("");
      
      const refreshedInventory = getInventory();
      setItems(refreshedInventory.filter(item => !item.isSoldOut && item.remainingQuantity > 0));
      
      onTransferComplete();
      if (onSubmit) onSubmit();
    } catch (error) {
      console.error("Error during transfer:", error);
      toast.error("Failed to complete transfer. Please try again.");
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (value === "") {
      setQuantity("");
      return;
    }
    
    setIsManualWeight(true);
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setQuantity(numValue);
      
      // Update bags based on weight only if weight per bag is valid
      if (weightPerBag > 0) {
        const calculatedBags = Math.round(numValue / weightPerBag);
        setBags(calculatedBags);
      }
    }
  };

  const handleBagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    
    if (isNaN(value)) {
      setBags(0);
      return;
    }
    
    setBags(value);
    setIsManualWeight(false);
  };

  const handleWeightPerBagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    
    if (isNaN(value) || value <= 0) {
      setWeightPerBag(50); // Default to 50kg if invalid
      return;
    }
    
    setWeightPerBag(value);
    setIsManualWeight(false);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="item">Select Item</Label>
            <Select value={selectedItem} onValueChange={setSelectedItem}>
              <SelectTrigger id="item">
                <SelectValue placeholder="Select an item to transfer" />
              </SelectTrigger>
              <SelectContent>
                {items.map(item => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.lotNumber} - {item.productType} ({item.remainingQuantity} kg)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fromLocation">From Location</Label>
              <Select value={fromLocation} onValueChange={setFromLocation}>
                <SelectTrigger id="fromLocation">
                  <SelectValue placeholder="Source location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="toLocation">To Location</Label>
              <Select value={toLocation} onValueChange={setToLocation}>
                <SelectTrigger id="toLocation">
                  <SelectValue placeholder="Destination location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bags">
                Number of Bags
              </Label>
              <Input
                id="bags"
                type="number"
                min="0"
                step="1"
                value={bags}
                onChange={handleBagsChange}
                placeholder="Enter number of bags"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weightPerBag">Weight per Bag (kg)</Label>
              <Input
                id="weightPerBag"
                type="number"
                min="0.01"
                step="0.01"
                value={weightPerBag}
                onChange={handleWeightPerBagChange}
                placeholder="Weight per bag"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">
                Total Weight (kg) {availableQuantity > 0 && `- Available: ${availableQuantity} kg`}
              </Label>
              <Input
                id="quantity"
                type="number"
                min="0.01"
                step="0.01"
                max={availableQuantity.toString()}
                value={quantity}
                onChange={handleQuantityChange}
                placeholder="Enter total weight to transfer"
                className={isManualWeight ? "border-amber-400" : ""}
              />
              {isManualWeight && (
                <p className="text-xs text-amber-600">Manual weight set</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes..."
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => onSubmit ? onSubmit() : onTransferComplete()}>
            Cancel
          </Button>
          <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
            Complete Transfer
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default TransferForm;
