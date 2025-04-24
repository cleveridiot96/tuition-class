
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { addCustomer, addSupplier, addBroker, addTransporter, addAgent } from '@/services/storageService';

export function useAddToMaster() {
  const [isOpen, setIsOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemType, setItemType] = useState<'customer' | 'supplier' | 'broker' | 'transporter' | 'agent'>('customer');
  const [callback, setCallback] = useState<((value: string) => void) | null>(null);

  const confirmAddToMaster = (
    name: string,
    onConfirm: (value: string) => void,
    type: 'customer' | 'supplier' | 'broker' | 'transporter' | 'agent' = 'customer'
  ) => {
    setItemName(name);
    setItemType(type);
    setCallback(() => onConfirm);
    setIsOpen(true);
  };

  const handleAddItem = () => {
    if (!itemName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    try {
      const newId = `${itemType}-${Date.now()}`;
      const newItem = {
        id: newId,
        name: itemName,
      };

      // Add to appropriate storage
      switch (itemType) {
        case 'customer':
          addCustomer(newItem);
          break;
        case 'supplier':
          addSupplier(newItem);
          break;
        case 'broker':
          addBroker({...newItem, commissionRate: 1}); // Default commission rate
          break;
        case 'transporter':
          addTransporter(newItem);
          break;
        case 'agent':
          addAgent(newItem);
          break;
      }

      toast.success(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} added successfully`);
      
      // Call the callback with the new ID
      if (callback) {
        callback(newId);
      }
      
      setIsOpen(false);
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error(`Failed to add ${itemType}`);
    }
  };

  const AddToMasterDialog = () => (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New {itemType.charAt(0).toUpperCase() + itemType.slice(1)}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="mt-2"
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddItem}>
            Add {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return {
    confirmAddToMaster,
    AddToMasterDialog,
  };
}
