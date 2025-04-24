
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InventoryItem } from '@/services/types';
import { getInventory, updateInventoryAfterTransfer, saveInventory } from '@/services/storageService';
import { toast } from "sonner";
import { EnhancedSearchableSelect } from '@/components/ui/enhanced-select';

const transferFormSchema = z.object({
  itemId: z.string().min(1, { message: "Inventory item is required." }),
  quantity: z.coerce.number().min(1, { message: "Quantity must be at least 1." }),
  fromLocation: z.string().min(1, { message: "From location is required." }),
  toLocation: z.string().min(1, { message: "To location is required." }),
});

interface TransferFormProps {
  onCancel: () => void;
  onSubmit: () => void;
}

type TransferFormValues = z.infer<typeof transferFormSchema>;

const TransferForm: React.FC<TransferFormProps> = ({ onCancel, onSubmit }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferFormSchema),
    defaultValues: {
      itemId: "",
      quantity: 1,
      fromLocation: "",
      toLocation: "",
    },
  });

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = () => {
    const inventoryData = getInventory() || [];
    // Filter for items that have remaining quantity
    const availableItems = inventoryData.filter(item => 
      (item.remainingQuantity || item.quantity) > 0 && !item.isDeleted
    );
    setInventory(availableItems);
  };

  useEffect(() => {
    if (selectedItemId) {
      const item = inventory.find(item => item.id === selectedItemId);
      if (item) {
        setSelectedItem(item);
        form.setValue('fromLocation', item.location);
      }
    }
  }, [selectedItemId, inventory, form]);

  const handleItemChange = (itemId: string) => {
    setSelectedItemId(itemId);
    form.setValue('itemId', itemId);
  };

  const onSubmitHandler = (values: TransferFormValues) => {
    try {
      const { itemId, quantity, fromLocation, toLocation } = values;
      
      if (fromLocation === toLocation) {
        toast.error("From and To locations cannot be the same");
        return;
      }

      // Update inventory using the imported function
      const updatedInventory = updateInventoryAfterTransfer(inventory, itemId, quantity, fromLocation, toLocation);
      
      // Save the updated inventory
      saveInventory(updatedInventory);
      
      toast.success("Inventory transferred successfully");

      onSubmit();
    } catch (error) {
      console.error("Error transferring inventory:", error);
      toast.error("Failed to transfer inventory");
    }
  };

  return (
    <Card className="bg-white border-green-100 shadow-md overflow-hidden">
      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="p-6 max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-green-800">Transfer Inventory</CardTitle>
            <CardDescription className="text-gray-600">Transfer inventory items between locations</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="itemId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inventory Item</FormLabel>
                      <FormControl>
                        <EnhancedSearchableSelect
                          options={inventory.map(item => ({
                            value: item.id,
                            label: `${item.lotNumber} (${item.remainingQuantity || item.quantity} bags in ${item.location})`
                          }))}
                          value={selectedItemId}
                          onValueChange={handleItemChange}
                          placeholder="Select inventory item"
                          emptyMessage="No inventory items found"
                          masterType="inventory"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          max={selectedItem ? (selectedItem.remainingQuantity || selectedItem.quantity) : undefined}
                        />
                      </FormControl>
                      {selectedItem && (
                        <p className="text-xs text-gray-500">
                          Available: {selectedItem.remainingQuantity || selectedItem.quantity} bags
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fromLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Location</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} readOnly={!!selectedItemId} />
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
                      <FormLabel>To Location</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={!selectedItem || form.watch('quantity') > (selectedItem.remainingQuantity || selectedItem.quantity)}
                  >
                    Transfer
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </div>
      </ScrollArea>
    </Card>
  );
};

export default TransferForm;
