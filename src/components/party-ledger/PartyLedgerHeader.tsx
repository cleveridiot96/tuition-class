
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedSearchableSelect } from "@/components/ui/enhanced-searchable-select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

interface PartyLedgerHeaderProps {
  partyType: string;
  setPartyType: (type: string) => void;
  partyId: string;
  setPartyId: (id: string) => void;
  partyOptions: { value: string; label: string; }[];
  addParty?: (partyData: any) => string | null;
  loadEntities?: () => void;
}

export const PartyLedgerHeader: React.FC<PartyLedgerHeaderProps> = ({
  partyType,
  setPartyType,
  partyId,
  setPartyId,
  partyOptions,
  addParty,
  loadEntities
}) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newPartyName, setNewPartyName] = useState("");
  const [nameError, setNameError] = useState("");

  const handleAddNewParty = () => {
    // Reset error state
    setNameError("");
    
    if (!newPartyName.trim()) {
      setNameError("Party name is required");
      return;
    }
    
    const newParty = {
      id: `${partyType}-${uuidv4()}`,
      name: newPartyName.trim(),
      balance: 0,
      isDeleted: false
    };
    
    if (addParty) {
      const newPartyId = addParty(newParty);
      if (newPartyId) {
        // Auto-select the newly added party
        setPartyId(newPartyId);
        setShowAddDialog(false);
        setNewPartyName("");
        
        // Refresh the entities list
        if (loadEntities) {
          loadEntities();
        }
      }
    }
  };

  const handleAddNewToMaster = (value: string) => {
    if (!value.trim()) return null;
    
    const newParty = {
      id: `${partyType}-${uuidv4()}`,
      name: value.trim(),
      balance: 0,
      isDeleted: false
    };
    
    if (addParty) {
      const newPartyId = addParty(newParty);
      if (newPartyId) {
        // Auto-select the newly added party
        setPartyId(newPartyId);
        
        // Refresh the entities list
        if (loadEntities) {
          loadEntities();
        }
        
        return newPartyId;
      }
    }
    return null;
  };
  
  return (
    <Card className="bg-gradient-to-br from-purple-100 to-purple-200 border-purple-200 shadow">
      <CardHeader>
        <CardTitle className="text-purple-800">Party Ledger</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Tabs defaultValue={partyType} onValueChange={setPartyType}>
            <TabsList className="mb-4">
              <TabsTrigger value="supplier">Suppliers</TabsTrigger>
              <TabsTrigger value="customer">Customers</TabsTrigger>
            </TabsList>

            <div className="mb-4 relative">
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="party-select" className="text-sm font-medium">
                  Select {partyType} <span className="text-red-500">*</span>
                </Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAddDialog(true)}
                  className="h-7 px-2 text-xs"
                >
                  Add New
                </Button>
              </div>
              <EnhancedSearchableSelect
                options={partyOptions}
                value={partyId}
                onValueChange={setPartyId}
                placeholder={`Select ${partyType === "supplier" ? "supplier" : "customer"}`}
                emptyMessage="No parties found"
                onAddNew={handleAddNewToMaster}
                masterType={partyType}
              />
              {!partyId && (
                <p className="text-sm text-purple-800 opacity-80 mt-1">
                  Please select a {partyType} to view their ledger
                </p>
              )}
            </div>
          </Tabs>
        </div>
      </CardContent>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-sm bg-white">
          <DialogHeader>
            <DialogTitle>Add New {partyType === "supplier" ? "Supplier" : "Customer"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="newPartyName">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="newPartyName"
                className={nameError ? "border-red-500" : ""}
                value={newPartyName}
                onChange={(e) => {
                  setNewPartyName(e.target.value);
                  if (e.target.value.trim()) setNameError("");
                }}
                placeholder="Enter name"
              />
              {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddNewParty}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
