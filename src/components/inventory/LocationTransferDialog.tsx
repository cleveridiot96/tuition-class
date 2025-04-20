
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAvailableInventoryByLocation, transferBetweenLocations } from '@/utils/locationTransfer';
import { getLocations } from '@/services/storageService';
import { toast } from 'sonner';

interface LocationTransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTransferComplete?: () => void;
}

const LocationTransferDialog: React.FC<LocationTransferDialogProps> = ({
  open,
  onOpenChange,
  onTransferComplete
}) => {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [date, setDate] = useState('');
  const [availableLots, setAvailableLots] = useState<any[]>([]);
  const [selectedLotDetails, setSelectedLotDetails] = useState<any>(null);
  const [locations, setLocations] = useState<string[]>([]);

  // Load locations and set date to today
  useEffect(() => {
    setLocations(getLocations() || ['Mumbai', 'Chiplun', 'Sawantwadi']);
    setDate(new Date().toISOString().split('T')[0]);
  }, []);

  // Update available lots when from location changes
  useEffect(() => {
    if (fromLocation) {
      const lots = getAvailableInventoryByLocation(fromLocation);
      setAvailableLots(lots);
      setLotNumber(''); // Reset lot number
      setSelectedLotDetails(null);
    } else {
      setAvailableLots([]);
    }
  }, [fromLocation]);

  // Update lot details when lot number changes
  useEffect(() => {
    if (lotNumber) {
      const lot = availableLots.find(l => l.lotNumber === lotNumber);
      setSelectedLotDetails(lot);
      if (lot) {
        setQuantity(lot.remainingQuantity);
      }
    }
  }, [lotNumber, availableLots]);

  const handleTransfer = () => {
    if (!fromLocation || !toLocation || !lotNumber || quantity <= 0) {
      toast.error("All fields are required");
      return;
    }

    if (fromLocation === toLocation) {
      toast.error("Source and destination locations cannot be the same");
      return;
    }

    if (!selectedLotDetails || selectedLotDetails.remainingQuantity < quantity) {
      toast.error("Insufficient quantity available for transfer");
      return;
    }

    const success = transferBetweenLocations({
      lotNumber,
      fromLocation,
      toLocation,
      quantity,
      date
    });

    if (success) {
      toast.success(`Successfully transferred ${quantity} bags from ${fromLocation} to ${toLocation}`);
      onOpenChange(false);
      if (onTransferComplete) onTransferComplete();
    } else {
      toast.error("Failed to transfer inventory");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Transfer Inventory Between Locations</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="fromLocation">From Location</Label>
            <Select
              value={fromLocation}
              onValueChange={setFromLocation}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select source location" />
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

          {fromLocation && (
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="lotNumber">Select Lot Number</Label>
              <Select
                value={lotNumber}
                onValueChange={setLotNumber}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select lot number" />
                </SelectTrigger>
                <SelectContent>
                  {availableLots.map(lot => (
                    <SelectItem key={lot.id} value={lot.lotNumber}>
                      {lot.lotNumber} ({lot.remainingQuantity} bags)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedLotDetails && (
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="quantity">Quantity to Transfer (Max: {selectedLotDetails.remainingQuantity})</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                max={selectedLotDetails.remainingQuantity}
                min={1}
              />
            </div>
          )}

          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="toLocation">To Location</Label>
            <Select
              value={toLocation}
              onValueChange={setToLocation}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select destination location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map(location => (
                  <SelectItem key={location} value={location} disabled={location === fromLocation}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="date">Transfer Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
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
