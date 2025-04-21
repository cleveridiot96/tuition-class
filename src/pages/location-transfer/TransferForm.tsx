
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTransferForm } from "./useTransferForm";
import { useNavigate } from "react-router-dom";

const TransferForm: React.FC = () => {
  const navigate = useNavigate();
  const {
    locations,
    availableItems,
    selectedItem,
    isSubmitting,
    form,
    fromLocation,
    lotNumber,
    onSubmit
  } = useTransferForm();

  const { watch, setValue, handleSubmit, reset } = form;

  return (
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
  );
};

export default TransferForm;
