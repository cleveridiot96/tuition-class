
import React, { useState } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EnhancedSearchableSelect } from "@/components/ui/enhanced-searchable-select";
import { addToMasterList } from "@/services/masterOperations";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface PurchaseTransportDetailsProps {
  form: any;
  formSubmitted?: boolean;
}

const PurchaseTransportDetails: React.FC<PurchaseTransportDetailsProps> = ({
  form,
  formSubmitted = false
}) => {
  const showErrors = formSubmitted || form.formState.isSubmitted;
  const [transporters, setTransporters] = useState<any[]>([]);
  const [showAddTransporterDialog, setShowAddTransporterDialog] = useState(false);
  const [newTransporterName, setNewTransporterName] = useState('');
  
  // Load transporters
  React.useEffect(() => {
    const fetchTransporters = async () => {
      try {
        // Import using dynamic import to avoid circular dependencies
        const storageService = await import('@/services/storageService');
        const data = storageService.getTransporters() || [];
        setTransporters(data.filter((t: any) => !t.isDeleted));
      } catch (error) {
        console.error("Error loading transporters:", error);
      }
    };
    
    fetchTransporters();
  }, [showAddTransporterDialog]);
  
  const transporterOptions = [
    { value: "", label: "None" },
    ...transporters.map(transporter => ({
      value: transporter.id,
      label: transporter.name
    }))
  ];
  
  const handleAddNewTransporter = () => {
    if (!newTransporterName.trim()) {
      toast.error('Transporter name is required');
      return;
    }
    
    const result = addToMasterList('transporter', { 
      name: newTransporterName.trim(),
      type: 'transporter'
    });
    
    if (result) {
      setNewTransporterName('');
      setShowAddTransporterDialog(false);
      toast.success('New transporter added successfully');
    }
  };

  return (
    <div className="border rounded-md p-4 bg-blue-50/40">
      <h3 className="text-lg font-medium mb-4 text-blue-800">Transport Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="transporterId"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between">
                <FormLabel>Transporter</FormLabel>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddTransporterDialog(true)}
                  className="h-6 px-2 text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" /> Add
                </Button>
              </div>
              <FormControl>
                <EnhancedSearchableSelect
                  options={transporterOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Select transporter"
                  className="w-full"
                />
              </FormControl>
              {showErrors && form.formState.errors.transporterId && (
                <FormMessage>{form.formState.errors.transporterId.message}</FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="transportRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transport Rate (₹/kg)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field}
                  value={field.value || ''}
                  step="0.01"
                />
              </FormControl>
              {showErrors && form.formState.errors.transportRate && (
                <FormMessage>{form.formState.errors.transportRate.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
      </div>
      
      {/* Add Transporter Dialog */}
      <Dialog open={showAddTransporterDialog} onOpenChange={setShowAddTransporterDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Add New Transporter</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <FormLabel>Transporter Name</FormLabel>
              <Input
                value={newTransporterName}
                onChange={(e) => setNewTransporterName(e.target.value)}
                placeholder="Enter transporter name"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddTransporterDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddNewTransporter}>Add Transporter</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchaseTransportDetails;
