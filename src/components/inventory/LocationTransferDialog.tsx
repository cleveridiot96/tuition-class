
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getLocations } from "@/services/storageService";

interface LocationTransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: string;
  currentLocation: string;
  onTransfer: (itemId: string, newLocation: string, quantity: number) => void;
  availableQuantity: number;
}

const LocationTransferDialog: React.FC<LocationTransferDialogProps> = ({
  open,
  onOpenChange,
  itemId,
  currentLocation,
  onTransfer,
  availableQuantity
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [targetLocation, setTargetLocation] = useState<string>("");
  const [locations, setLocations] = useState<string[]>([]);
  
  React.useEffect(() => {
    if (open) {
      setQuantity(1);
      setTargetLocation("");
      
      // Load locations from storage service
      const availableLocations = getLocations() || ['Mumbai', 'Chiplun', 'Sawantwadi'];
      setLocations(availableLocations.filter(location => location !== currentLocation));
    }
  }, [open, currentLocation]);
  
  const handleTransfer = () => {
    if (!targetLocation) {
      toast.error("Please select a target location");
      return;
    }
    
    if (quantity <= 0 || quantity > availableQuantity) {
      toast.error(`Quantity must be between 1 and ${availableQuantity}`);
      return;
    }
    
    onTransfer(itemId, targetLocation, quantity);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer to Another Location</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="current-location">Current Location</Label>
            <Input 
              id="current-location"
              value={currentLocation}
              disabled
              className="mt-2"
            />
          </div>
          
          <div>
            <Label htmlFor="target-location">Target Location</Label>
            <Select 
              value={targetLocation} 
              onValueChange={setTargetLocation}
            >
              <SelectTrigger className="mt-2">
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
            <Label htmlFor="quantity">
              Quantity (Available: {availableQuantity})
            </Label>
            <Input 
              id="quantity"
              type="number"
              min={1}
              max={availableQuantity}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="mt-2"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleTransfer}>
            Transfer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LocationTransferDialog;
