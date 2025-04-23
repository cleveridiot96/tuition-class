
import React, { useState, useEffect } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { PurchaseFormData } from "../PurchaseFormSchema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSuppliers, addSupplier } from "@/services/storageService";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";
import { useAddToMaster } from "@/hooks/useAddToMaster";

interface PartySelectorProps {
  form: UseFormReturn<PurchaseFormData>;
  partyManagement: any;
}

const PartySelector: React.FC<PartySelectorProps> = ({ form, partyManagement }) => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [showAddPartyDialog, setShowAddPartyDialog] = useState<boolean>(false);
  const [newPartyName, setNewPartyName] = useState<string>("");
  const { confirmAddToMaster, AddToMasterDialog } = useAddToMaster();
  
  useEffect(() => {
    loadSuppliers();
  }, []);
  
  const loadSuppliers = () => {
    const supplierData = getSuppliers() || [];
    setSuppliers(supplierData);
  };
  
  const handleAddNewParty = () => {
    if (!newPartyName.trim()) {
      toast.error("Party name is required");
      return;
    }
    
    const newParty = {
      id: `supplier-${uuidv4()}`,
      name: newPartyName.trim(),
      balance: 0
    };
    
    try {
      addSupplier(newParty);
      loadSuppliers();
      form.setValue("party", newPartyName.trim());
      setShowAddPartyDialog(false);
      toast.success("New party added successfully");
      setNewPartyName("");
    } catch (error) {
      console.error("Error adding new party:", error);
      toast.error("Failed to add new party. Please try again.");
    }
  };

  const handleSelectChange = (value: string) => {
    if (value === "add_new") {
      setShowAddPartyDialog(true);
    } else {
      form.setValue("party", value);
    }
  };
  
  return (
    <>
      <FormField
        control={form.control}
        name="party"
        render={({ field }) => (
          <FormItem>
            <div className="flex justify-between">
              <FormLabel>Party Name</FormLabel>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowAddPartyDialog(true)}
                className="h-6 px-2 text-xs"
              >
                <Plus className="w-3 h-3 mr-1" /> Add
              </Button>
            </div>
            <FormControl>
              <Select
                value={field.value || ""}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select party" />
                </SelectTrigger>
                <SelectContent className="bg-white max-h-[300px]">
                  {suppliers.map((supplier: any) => (
                    <SelectItem key={supplier.id} value={supplier.name}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="add_new" className="text-blue-600 font-medium">
                    + Add new party
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <Dialog open={showAddPartyDialog} onOpenChange={setShowAddPartyDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Add New Party</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newPartyName">Party Name</Label>
              <Input 
                id="newPartyName"
                value={newPartyName}
                onChange={(e) => setNewPartyName(e.target.value)}
                placeholder="Enter party name"
                autoComplete="off"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddPartyDialog(false)}>Cancel</Button>
              <Button onClick={handleAddNewParty}>Add Party</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <AddToMasterDialog />
    </>
  );
};

export default PartySelector;
