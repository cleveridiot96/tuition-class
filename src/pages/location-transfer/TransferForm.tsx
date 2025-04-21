
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { getInventory, getLocations, updateInventoryItem } from "@/services/storageService";
import TransferHistory from "./TransferHistory";
import { saveTransferHistory } from "@/services/transferService";

const transferFormSchema = z.object({
  date: z.string().min(1, "Date is required"),
  fromLocation: z.string().min(1, "Source location is required"),
  toLocation: z.string().min(1, "Destination location is required"),
  lotNumber: z.string().min(1, "Lot number is required"),
  bags: z.coerce.number().min(1, "Must transfer at least 1 bag"),
  notes: z.string().optional(),
}).refine((data) => data.fromLocation !== data.toLocation, {
  message: "Source and destination locations must be different",
  path: ["toLocation"],
});

type TransferFormValues = z.infer<typeof transferFormSchema>;

const TransferForm: React.FC = () => {
  const [locations, setLocations] = useState<string[]>([]);
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [selectedFromLocation, setSelectedFromLocation] = useState<string>("");
  const [selectedLotNumber, setSelectedLotNumber] = useState<string>("");
  const [maxBags, setMaxBags] = useState<number>(0);
  
  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferFormSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      fromLocation: "",
      toLocation: "",
      lotNumber: "",
      bags: 1,
      notes: "",
    },
  });
  
  useEffect(() => {
    // Load locations and inventory data
    const loadData = () => {
      const availableLocations = getLocations();
      setLocations(availableLocations);
      
      const inventory = getInventory();
      if (inventory) {
        const activeItems = inventory.filter(item => !item.isDeleted && item.remainingQuantity > 0);
        setInventoryItems(activeItems);
      }
    };
    
    loadData();
  }, []);
  
  // Filter inventory items when from location changes
  useEffect(() => {
    if (selectedFromLocation) {
      const items = inventoryItems.filter(item => 
        item.location === selectedFromLocation && item.remainingQuantity > 0
      );
      setFilteredItems(items);
      form.setValue("lotNumber", "");
      setSelectedLotNumber("");
    } else {
      setFilteredItems([]);
    }
  }, [selectedFromLocation, inventoryItems, form]);
  
  // Update maximum bags when lot number changes
  useEffect(() => {
    if (selectedLotNumber) {
      const selectedItem = inventoryItems.find(item => 
        item.lotNumber === selectedLotNumber && item.location === selectedFromLocation
      );
      
      if (selectedItem) {
        setMaxBags(selectedItem.remainingQuantity);
        form.setValue("bags", 1);
      } else {
        setMaxBags(0);
      }
    } else {
      setMaxBags(0);
    }
  }, [selectedLotNumber, selectedFromLocation, inventoryItems, form]);
  
  const handleLocationChange = (value: string) => {
    setSelectedFromLocation(value);
    form.setValue("fromLocation", value);
  };
  
  const handleLotNumberChange = (value: string) => {
    setSelectedLotNumber(value);
    form.setValue("lotNumber", value);
  };
  
  const handleSubmit = (values: TransferFormValues) => {
    try {
      // Find the source inventory item
      const sourceItem = inventoryItems.find(item => 
        item.lotNumber === values.lotNumber && item.location === values.fromLocation
      );
      
      if (!sourceItem) {
        toast.error("Source inventory item not found");
        return;
      }
      
      if (sourceItem.remainingQuantity < values.bags) {
        toast.error(`Only ${sourceItem.remainingQuantity} bags available at ${values.fromLocation}`);
        return;
      }
      
      // Check if there's an existing item at the destination with the same lot number
      const existingDestItem = inventoryItems.find(item => 
        item.lotNumber === values.lotNumber && item.location === values.toLocation && !item.isDeleted
      );
      
      // Calculate weight per bag
      const weightPerBag = sourceItem.netWeight / sourceItem.quantity;
      const transferWeight = weightPerBag * values.bags;
      
      // Update source inventory
      const updatedSourceItem = {
        ...sourceItem,
        remainingQuantity: sourceItem.remainingQuantity - values.bags,
        remainingWeight: sourceItem.remainingWeight - transferWeight
      };
      
      updateInventoryItem(updatedSourceItem);
      
      // Update or create destination inventory
      if (existingDestItem) {
        const updatedDestItem = {
          ...existingDestItem,
          remainingQuantity: existingDestItem.remainingQuantity + values.bags,
          remainingWeight: existingDestItem.remainingWeight + transferWeight
        };
        
        updateInventoryItem(updatedDestItem);
      } else {
        // Create new inventory item at destination
        const newDestItem = {
          ...sourceItem,
          id: uuidv4(),
          location: values.toLocation,
          quantity: values.bags,
          remainingQuantity: values.bags,
          netWeight: transferWeight,
          remainingWeight: transferWeight,
          transferredFrom: values.fromLocation,
          transferDate: values.date
        };
        
        updateInventoryItem(newDestItem);
      }
      
      // Save transfer history
      saveTransferHistory({
        id: uuidv4(),
        date: values.date,
        lotNumber: values.lotNumber,
        fromLocation: values.fromLocation,
        toLocation: values.toLocation,
        bags: values.bags,
        weight: transferWeight,
        notes: values.notes || "",
        createdAt: new Date().toISOString()
      });
      
      toast.success("Stock transferred successfully");
      
      // Reset form
      form.reset({
        date: new Date().toISOString().split("T")[0],
        fromLocation: "",
        toLocation: "",
        lotNumber: "",
        bags: 1,
        notes: "",
      });
      
      setSelectedFromLocation("");
      setSelectedLotNumber("");
      setMaxBags(0);
      
      // Refresh inventory data
      const inventory = getInventory();
      if (inventory) {
        const activeItems = inventory.filter(item => !item.isDeleted && item.remainingQuantity > 0);
        setInventoryItems(activeItems);
      }
      
    } catch (error) {
      console.error("Error during transfer:", error);
      toast.error("Failed to transfer stock");
    }
  };
  
  return (
    <div>
      <Tabs defaultValue="transfer" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="transfer">New Transfer</TabsTrigger>
          <TabsTrigger value="history">Transfer History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transfer">
          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100 shadow-md">
            <CardHeader className="border-b border-purple-100 bg-gradient-to-r from-purple-100 to-indigo-100">
              <CardTitle className="text-purple-800">Transfer Stock Between Locations</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="fromLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Source Location</FormLabel>
                          <FormControl>
                            <Select 
                              value={field.value} 
                              onValueChange={value => handleLocationChange(value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select source location" />
                              </SelectTrigger>
                              <SelectContent>
                                {locations.map(location => (
                                  <SelectItem key={`from-${location}`} value={location}>
                                    {location}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="toLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Destination Location</FormLabel>
                          <FormControl>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select destination location" />
                              </SelectTrigger>
                              <SelectContent>
                                {locations
                                  .filter(location => location !== selectedFromLocation)
                                  .map(location => (
                                    <SelectItem key={`to-${location}`} value={location}>
                                      {location}
                                    </SelectItem>
                                  ))
                                }
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lotNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lot Number</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={value => handleLotNumberChange(value)}
                              disabled={!selectedFromLocation}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select lot number" />
                              </SelectTrigger>
                              <SelectContent>
                                {filteredItems.map(item => (
                                  <SelectItem key={`lot-${item.id}`} value={item.lotNumber}>
                                    {item.lotNumber} ({item.remainingQuantity} bags)
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="bags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bags to Transfer {maxBags > 0 ? `(Max: ${maxBags})` : ""}</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              min={1}
                              max={maxBags}
                              disabled={maxBags <= 0}
                              onChange={e => {
                                const value = parseInt(e.target.value);
                                if (isNaN(value)) {
                                  field.onChange(1);
                                } else if (value < 1) {
                                  field.onChange(1);
                                } else if (value > maxBags) {
                                  field.onChange(maxBags);
                                } else {
                                  field.onChange(value);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Notes (Optional)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Add any additional notes here" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                      disabled={!selectedLotNumber || !form.watch("toLocation")}
                    >
                      Transfer Stock
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <TransferHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransferForm;
