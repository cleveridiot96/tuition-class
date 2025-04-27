
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SelectOption } from "@/components/ui/enhanced-select/types";
import { MasterType } from "@/types/master.types";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PartyForm } from "./PartyForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PartyLedgerHeaderProps {
  partyType: string;
  setPartyType: (type: string) => void;
  partyId: string;
  setPartyId: (id: string) => void;
  partyOptions: SelectOption[];
  addParty: (party: any) => string | null;
  loadEntities: () => void;
}

export const PartyLedgerHeader: React.FC<PartyLedgerHeaderProps> = ({
  partyType,
  setPartyType,
  partyId,
  setPartyId,
  partyOptions,
  addParty,
  loadEntities,
}) => {
  const [showAddPartyDialog, setShowAddPartyDialog] = useState(false);
  const [newPartyName, setNewPartyName] = useState("");
  
  console.log("PartyLedgerHeader - partyOptions:", partyOptions);
  console.log("PartyLedgerHeader - partyId:", partyId);
  console.log("PartyLedgerHeader - partyType:", partyType);

  const handleAddParty = () => {
    if (newPartyName.trim()) {
      const partyData = {
        name: newPartyName.trim(),
        type: partyType as MasterType,
        createdAt: new Date().toISOString(),
      };

      const newPartyId = addParty(partyData);
      if (newPartyId) {
        setPartyId(newPartyId);
        setNewPartyName("");
        setShowAddPartyDialog(false);
        loadEntities();
      }
    }
  };

  return (
    <Card className="bg-white shadow-sm border-purple-100">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Party Type</Label>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={partyType === "supplier" ? "default" : "outline"}
                onClick={() => setPartyType("supplier")}
                className="flex-1"
              >
                Supplier
              </Button>
              <Button
                type="button"
                variant={partyType === "customer" ? "default" : "outline"}
                onClick={() => setPartyType("customer")}
                className="flex-1"
              >
                Customer
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Select Party</Label>
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
            <SearchableSelect
              options={partyOptions || []}
              value={partyId}
              onValueChange={setPartyId}
              placeholder={`Select a ${partyType}`}
            />
          </div>

          <div className="space-y-2">
            <Label>Actions</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => console.log("Export not implemented")}
                className="flex-1"
              >
                Export
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => console.log("Print not implemented")}
                className="flex-1"
              >
                Print
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      <Dialog open={showAddPartyDialog} onOpenChange={setShowAddPartyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New {partyType === "supplier" ? "Supplier" : "Customer"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="partyName">
                Party Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="partyName"
                value={newPartyName}
                onChange={(e) => setNewPartyName(e.target.value)}
                placeholder={`Enter ${partyType} name`}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowAddPartyDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddParty}>
                Add {partyType === "supplier" ? "Supplier" : "Customer"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

// In case PartyForm component doesn't exist yet, create a stub
export const PartyForm: React.FC<any> = () => {
  return <div>Party Form</div>;
};
