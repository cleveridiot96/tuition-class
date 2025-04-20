
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TransporterForm from "@/components/transporters/TransporterForm";
import { TransportSectionProps } from '../../shared/types/PurchaseFormTypes';
import { FormRow } from "@/components/ui/form";

const TransportSection: React.FC<TransportSectionProps> = ({
  transporters,
  transporterId,
  transportCost,
  onSelectChange,
  onInputChange,
  onAddTransporterClick,
  showAddTransporterDialog,
  setShowAddTransporterDialog,
  onTransporterAdded
}) => {
  return (
    <FormRow>
      <div>
        <div className="flex justify-between items-center">
          <Label htmlFor="transporterId">Transporter</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={onAddTransporterClick}
          >
            Add New
          </Button>
        </div>
        <Select
          name="transporterId"
          value={transporterId}
          onValueChange={(value) => onSelectChange('transporterId', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select transporter" />
          </SelectTrigger>
          <SelectContent>
            {transporters.map(transporter => (
              <SelectItem key={transporter.id} value={transporter.id}>
                {transporter.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="transportCost">Transport Cost</Label>
        <Input
          id="transportCost"
          name="transportCost"
          type="number"
          value={transportCost}
          onChange={onInputChange}
        />
      </div>

      <Dialog open={showAddTransporterDialog} onOpenChange={setShowAddTransporterDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Transporter</DialogTitle>
          </DialogHeader>
          <TransporterForm 
            onTransporterAdded={onTransporterAdded} 
            onCancel={() => setShowAddTransporterDialog(false)} 
          />
        </DialogContent>
      </Dialog>
    </FormRow>
  );
};

export default TransportSection;
