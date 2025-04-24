import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getInventory, saveInventory } from "@/services/storageService";
import { InventoryItem } from "@/services/types";
import { toast } from 'sonner';

interface TransferFormProps {
  onTransferComplete: () => void;
}

const TransferForm: React.FC<TransferFormProps> = ({ onTransferComplete }) => {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [lotNumber, setLotNumber] = useState('');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const storedInventory = getInventory();
    setInventory(storedInventory);
  }, []);

  useEffect(() => {
    if (fromLocation) {
      const filteredInventory = inventory.filter((item) => item.location === fromLocation);
      setInventoryItems(filteredInventory);
    } else {
      setInventoryItems([]);
    }
  }, [fromLocation, inventory]);

  const locations = ['Mumbai', 'Chiplun', 'Sawantwadi'];

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!fromLocation || !toLocation || quantity === '' || !lotNumber) {
      toast.error('Please fill in all fields.');
      return;
    }

    const quantityNumber = Number(quantity);

    if (isNaN(quantityNumber) || quantityNumber <= 0) {
      toast.error('Please enter a valid quantity.');
      return;
    }

    const itemToTransfer = inventory.find(item => item.lotNumber === lotNumber && item.location === fromLocation);

    if (!itemToTransfer) {
      toast.error('Lot number not found in the selected location.');
      return;
    }

    if (itemToTransfer.remainingQuantity < quantityNumber) {
      toast.error('Not enough quantity available for transfer.');
      return;
    }

    const updatedInventory = inventory.map(item => {
      if (item.lotNumber === lotNumber && item.location === fromLocation) {
        return { ...item, remainingQuantity: item.remainingQuantity - quantityNumber };
      } else if (item.lotNumber === lotNumber && item.location === toLocation) {
        return { ...item, quantity: item.quantity + quantityNumber, remainingQuantity: item.remainingQuantity + quantityNumber };
      }
      return item;
    });

    const existingItemInToLocation = updatedInventory.find(item => item.lotNumber === lotNumber && item.location === toLocation);

    if (!existingItemInToLocation) {
      const newItem: InventoryItem = {
        id: Date.now().toString(),
        purchaseId: itemToTransfer.purchaseId,
        lotNumber: itemToTransfer.lotNumber,
        date: itemToTransfer.date,
        quantity: quantityNumber,
        remainingQuantity: quantityNumber,
        location: toLocation,
        netWeight: itemToTransfer.netWeight,
        rate: itemToTransfer.rate,
        ratePerKgAfterExpenses: itemToTransfer.ratePerKgAfterExpenses,
        supplier: itemToTransfer.supplier,
        isDeleted: false,
        dateAdded: new Date().toISOString(),
        finalCost: itemToTransfer.finalCost,
        purchaseRate: itemToTransfer.purchaseRate,
        agentName: itemToTransfer.agentName,
        agentId: itemToTransfer.agentId
      };
      updatedInventory.push(newItem);
    }

    saveInventory(updatedInventory);
    setInventory(updatedInventory);
    setFromLocation('');
    setToLocation('');
    setQuantity('');
    setLotNumber('');
    onTransferComplete();
    toast.success('Inventory transferred successfully!');
  };

  const filteredInventory = inventory.filter((item) => item.location === fromLocation);
  const filteredItems = filteredInventory || [];

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 space-y-4">
      <div>
        <Label htmlFor="fromLocation">From Location</Label>
        <Select value={fromLocation} onValueChange={setFromLocation}>
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="toLocation">To Location</Label>
        <Select value={toLocation} onValueChange={setToLocation}>
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="lotNumber">Lot Number</Label>
        <Select value={lotNumber} onValueChange={setLotNumber}>
          <SelectTrigger>
            <SelectValue placeholder="Select Lot Number" />
          </SelectTrigger>
          <SelectContent>
            {filteredItems.map((item) => (
              <SelectItem key={item.lotNumber} value={item.lotNumber}>
                {item.lotNumber}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="quantity">Quantity to Transfer</Label>
        <Input
          type="number"
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Enter quantity"
        />
      </div>
      <Button type="submit" className="w-full">Transfer Inventory</Button>
    </form>
  );
};

export default TransferForm;
