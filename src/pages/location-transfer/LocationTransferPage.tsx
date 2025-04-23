import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { getInventory, getLocations, updateInventoryItem } from '@/services/storageService';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useHotkeys } from '@/hooks/useHotkeys';

const LocationTransferPage = () => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [sourceLocation, setSourceLocation] = useState('');
  const [targetLocation, setTargetLocation] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [filteredInventory, setFilteredInventory] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useHotkeys([
    { key: 'Enter', handler: () => handleTransfer(), description: 'Submit transfer' },
    { key: 'Escape', handler: () => resetForm(), description: 'Reset form' }
  ]);

  useEffect(() => {
    const storedInventory = getInventory() || [];
    const storedLocations = getLocations() || ['Mumbai', 'Chiplun', 'Sawantwadi'];
    
    setInventory(storedInventory);
    setLocations(storedLocations);
    
    if (storedLocations.length > 0) {
      setSourceLocation(storedLocations[0]);
      if (storedLocations.length > 1) {
        setTargetLocation(storedLocations[1]);
      }
    }
  }, []);

  useEffect(() => {
    if (sourceLocation) {
      const filtered = inventory.filter(item => 
        item.location === sourceLocation && item.quantity > 0 &&
        (searchTerm === '' || item.lotNumber.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredInventory(filtered);
    } else {
      setFilteredInventory([]);
    }
  }, [inventory, sourceLocation, searchTerm]);

  useEffect(() => {
    if (selectedItem) {
      const item = inventory.find(item => 
        item.id === selectedItem && item.location === sourceLocation
      );
      setAvailableQuantity(item ? item.quantity : 0);
    } else {
      setAvailableQuantity(0);
    }
  }, [selectedItem, inventory, sourceLocation]);

  const handleTransfer = () => {
    if (!sourceLocation || !targetLocation) {
      toast.error('Please select source and target locations');
      return;
    }

    if (!selectedItem) {
      toast.error('Please select an item to transfer');
      return;
    }

    if (sourceLocation === targetLocation) {
      toast.error('Source and target locations must be different');
      return;
    }

    if (quantity <= 0 || quantity > availableQuantity) {
      toast.error(`Quantity must be between 1 and ${availableQuantity}`);
      return;
    }

    try {
      const sourceItem = inventory.find(item => item.id === selectedItem && item.location === sourceLocation);
      if (!sourceItem) {
        toast.error('Item not found in source location');
        return;
      }

      const existingTargetItem = inventory.find(item => 
        item.lotNumber === sourceItem.lotNumber && 
        item.location === targetLocation
      );

      const updatedInventory = [...inventory];
      
      const sourceIndex = updatedInventory.findIndex(item => item.id === selectedItem);
      updatedInventory[sourceIndex] = {
        ...updatedInventory[sourceIndex],
        quantity: updatedInventory[sourceIndex].quantity - quantity
      };

      if (existingTargetItem) {
        const targetIndex = updatedInventory.findIndex(item => item.id === existingTargetItem.id);
        updatedInventory[targetIndex] = {
          ...updatedInventory[targetIndex],
          quantity: updatedInventory[targetIndex].quantity + quantity
        };
      } else {
        const newTargetItem = {
          ...sourceItem,
          id: `${sourceItem.lotNumber}-${targetLocation}-${Date.now()}`,
          location: targetLocation,
          quantity: quantity
        };
        updatedInventory.push(newTargetItem);
      }

      updatedInventory.forEach(item => {
        const originalItem = inventory.find(i => i.id === item.id);
        if (originalItem && JSON.stringify(originalItem) !== JSON.stringify(item)) {
          updateInventoryItem(item);
        }
      });
      
      setInventory(updatedInventory);
      
      toast.success('Inventory transfer completed', {
        description: `${quantity} units of ${sourceItem.lotNumber} moved from ${sourceLocation} to ${targetLocation}`
      });

      setSelectedItem('');
      setQuantity(1);
      
    } catch (error) {
      console.error("Error during transfer:", error);
      toast.error('Failed to transfer inventory');
    }
  };

  const resetForm = () => {
    setSelectedItem('');
    setQuantity(1);
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <Navigation title="Location Transfer" showBackButton />
      
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-white shadow-lg border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            <CardTitle className="text-xl md:text-2xl">Location Transfer</CardTitle>
          </CardHeader>
          
          <CardContent className="p-6">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-6 max-w-2xl mx-auto">
                <div className="mb-6">
                  <Label htmlFor="search" className="text-lg font-medium">Search Inventory</Label>
                  <Input
                    id="search"
                    placeholder="Search by lot number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="source-location" className="text-lg font-medium">Source Location</Label>
                    <Select
                      value={sourceLocation}
                      onValueChange={setSourceLocation}
                    >
                      <SelectTrigger id="source-location" className="mt-1">
                        <SelectValue placeholder="Select source location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map(loc => (
                          <SelectItem key={`source-${loc}`} value={loc}>{loc}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="target-location" className="text-lg font-medium">Target Location</Label>
                    <Select
                      value={targetLocation}
                      onValueChange={setTargetLocation}
                    >
                      <SelectTrigger id="target-location" className="mt-1">
                        <SelectValue placeholder="Select target location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map(loc => (
                          <SelectItem key={`target-${loc}`} value={loc}>{loc}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="item-select" className="text-lg font-medium">Select Item</Label>
                  <Select
                    value={selectedItem}
                    onValueChange={setSelectedItem}
                    disabled={!sourceLocation || filteredInventory.length === 0}
                  >
                    <SelectTrigger id="item-select" className="mt-1">
                      <SelectValue placeholder={
                        !sourceLocation 
                          ? "Select source location first" 
                          : filteredInventory.length === 0 
                          ? "No items available in this location" 
                          : "Select an item"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredInventory.map(item => (
                        <SelectItem key={item.id} value={item.id}>
                          {`${item.lotNumber} - ${item.quantity} units`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="quantity" className="text-lg font-medium">
                    Quantity {availableQuantity > 0 && `(Available: ${availableQuantity})`}
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    min={1}
                    max={availableQuantity}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    disabled={!selectedItem}
                    className="mt-1"
                  />
                </div>
                
                <div className="flex justify-center pt-4">
                  <Button 
                    onClick={handleTransfer}
                    disabled={!selectedItem || quantity <= 0 || quantity > availableQuantity || sourceLocation === targetLocation}
                    size="lg"
                    className="w-full md:w-auto text-lg py-6 bg-purple-600 hover:bg-purple-700"
                  >
                    Transfer Now
                  </Button>
                </div>

                <div className="mt-4 text-sm text-gray-600 bg-purple-50 p-4 rounded-lg">
                  <p className="font-medium mb-2">Quick Guide:</p>
                  <ol className="list-decimal ml-5 space-y-1">
                    <li>Select the source location containing your stock</li>
                    <li>Select the target location where you want to move stock</li>
                    <li>Choose the item you want to transfer</li>
                    <li>Enter the quantity (must be available in source location)</li>
                    <li>Click "Transfer Now" to complete</li>
                  </ol>
                  <p className="mt-2"><strong>Shortcuts:</strong> Press Enter to transfer, Esc to reset form</p>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LocationTransferPage;
