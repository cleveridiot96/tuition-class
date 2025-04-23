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
import { getInventory, updateInventoryAfterTransfer } from '@/services/storageService';
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();

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
    const loadInventory = () => {
      const inventoryData = getInventory() || [];
      setInventory(inventoryData);
    };

    loadInventory();
  }, []);

  const handleItemChange = (itemId: string) => {
    setSelectedItemId(itemId);
  };

  const onSubmitHandler = async (values: TransferFormValues) => {
    try {
      const itemId = values.itemId;
      const quantity = values.quantity;
      const fromLocation = values.fromLocation;
      const toLocation = values.toLocation;

      // Find the selected inventory item
      const itemIndex = inventory.findIndex(item => item.id === itemId);
      if (itemIndex === -1) {
        toast({
          title: "Error",
          description: "Inventory item not found.",
          variant: "destructive",
        });
        return;
      }

      const item = inventory[itemIndex];

      // Check if there is enough quantity in the from location
      if (item.location !== fromLocation || item.remainingQuantity === undefined || item.remainingQuantity < quantity) {
        toast({
          title: "Error",
          description: `Not enough quantity in ${fromLocation}. Available: ${item.remainingQuantity || 0}`,
          variant: "destructive",
        });
        return;
      }

      // Update inventory
      const updatedInventory = updateInventoryAfterTransfer(inventory, itemId, quantity, fromLocation, toLocation);
      setInventory(updatedInventory);

      toast({
        title: "Success",
        description: "Inventory transferred successfully.",
      });

      onSubmit();
    } catch (error) {
      console.error("Error transferring inventory:", error);
      toast({
        title: "Error",
        description: "Failed to transfer inventory.",
        variant: "destructive",
      });
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
                <FormItem>
                  <FormLabel>Inventory Item</FormLabel>
                  <FormControl>
                    <EnhancedSearchableSelect
                      options={inventory.map(item => ({
                        value: item.id,
                        label: `${item.lotNumber} (${item.remainingQuantity || 0} bags)`
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

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
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
                      <FormLabel>From Location</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
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
                  <Button type="submit">Transfer</Button>
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
