
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import { 
  getLocations,
  getAvailableInventoryByLocation,
  transferBetweenLocations
} from "@/utils/locationTransfer";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TransferFormValues {
  lotNumber: string;
  fromLocation: string;
  toLocation: string;
  quantity: number;
  date: string;
  notes?: string;
}

const LocationTransfer = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<string[]>([]);
  const [availableItems, setAvailableItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<TransferFormValues>({
    defaultValues: {
      lotNumber: "",
      fromLocation: "",
      toLocation: "",
      quantity: 1,
      date: new Date().toISOString().split('T')[0],
      notes: ""
    }
  });

  const { watch, setValue, handleSubmit, reset } = form;
  const fromLocation = watch("fromLocation");
  const lotNumber = watch("lotNumber");
  
  useEffect(() => {
    // Load available locations
    const availableLocations = getLocations();
    setLocations(availableLocations);
  }, []);
  
  useEffect(() => {
    if (fromLocation) {
      // Load available inventory items for the selected location
      const items = getAvailableInventoryByLocation(fromLocation);
      setAvailableItems(items);
      
      // Reset selected item and lot number when location changes
      setSelectedItem(null);
      setValue("lotNumber", "");
    }
  }, [fromLocation, setValue]);
  
  useEffect(() => {
    if (lotNumber && availableItems.length > 0) {
      const item = availableItems.find(i => i.lotNumber === lotNumber);
      setSelectedItem(item || null);
      
      if (item) {
        // Set maximum available quantity
        setValue("quantity", Math.min(item.remainingQuantity, form.getValues("quantity")));
      }
    }
  }, [lotNumber, availableItems, setValue, form]);
  
  const onSubmit = (data: TransferFormValues) => {
    setIsSubmitting(true);
    
    try {
      const success = transferBetweenLocations({
        lotNumber: data.lotNumber,
        fromLocation: data.fromLocation,
        toLocation: data.toLocation,
        quantity: data.quantity,
        date: data.date
      });
      
      if (success) {
        toast.success(`Successfully transferred ${data.quantity} units of ${data.lotNumber} from ${data.fromLocation} to ${data.toLocation}`);
        reset();
      } else {
        toast.error("Failed to transfer inventory. Please try again.");
      }
    } catch (error) {
      console.error("Transfer error:", error);
      toast.error("An error occurred during transfer");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation title="Location Transfer" showBackButton />
      
      <div className="container mx-auto py-8 px-4">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Transfer Inventory Between Locations</h2>
          
          <ScrollArea className="h-[calc(100vh-250px)] pr-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fromLocation">From Location</Label>
                  <Select
                    value={fromLocation}
                    onValueChange={(value) => {
                      setValue("fromLocation", value);
                      // Reset to location if it's the same as from location
                      if (value === watch("toLocation")) {
                        setValue("toLocation", "");
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select source location" />
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
                
                <div className="space-y-2">
                  <Label htmlFor="toLocation">To Location</Label>
                  <Select
                    value={watch("toLocation")}
                    onValueChange={(value) => setValue("toLocation", value)}
                    disabled={!fromLocation}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations
                        .filter(loc => loc !== fromLocation)
                        .map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lotNumber">Lot Number</Label>
                <Select
                  value={lotNumber}
                  onValueChange={(value) => setValue("lotNumber", value)}
                  disabled={!fromLocation}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select lot number" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableItems.map((item) => (
                      <SelectItem key={item.id} value={item.lotNumber}>
                        {item.lotNumber} ({item.remainingQuantity} units available)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedItem && (
                <div className="bg-gray-50 border rounded-md p-4 space-y-2">
                  <p><span className="font-medium">Available:</span> {selectedItem.remainingQuantity} units</p>
                  {selectedItem.netWeight && (
                    <p><span className="font-medium">Net Weight:</span> {selectedItem.netWeight} kg</p>
                  )}
                  {selectedItem.rate && (
                    <p><span className="font-medium">Rate:</span> ₹{selectedItem.rate}</p>
                  )}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity to Transfer</Label>
                  <Input
                    type="number"
                    min={1}
                    max={selectedItem?.remainingQuantity || 1}
                    value={watch("quantity")}
                    onChange={(e) => setValue("quantity", parseInt(e.target.value, 10))}
                    disabled={!selectedItem}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Transfer Date</Label>
                  <Input
                    type="date"
                    value={watch("date")}
                    onChange={(e) => setValue("date", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  value={watch("notes") || ""}
                  onChange={(e) => setValue("notes", e.target.value)}
                  placeholder="Any additional notes"
                />
              </div>
              
              <div className="flex justify-end space-x-4 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !selectedItem || !watch("toLocation")}
                >
                  {isSubmitting ? "Processing..." : "Transfer Inventory"}
                </Button>
              </div>
            </form>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
};

export default LocationTransfer;
