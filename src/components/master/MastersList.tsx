
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateMaster, deleteMaster } from "@/services/masterService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Master {
  id: string;
  name: string;
  type?: string;
  commissionRate?: number;
  isDeleted?: boolean;
}

interface MastersListProps {
  masters: Master[];
  onUpdate: () => void;
}

export const MastersList: React.FC<MastersListProps> = ({ masters, onUpdate }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editCommissionRate, setEditCommissionRate] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [masterToDelete, setMasterToDelete] = useState<Master | null>(null);

  const handleEditClick = (master: Master) => {
    setEditingId(master.id);
    setEditName(master.name);
    setEditCommissionRate(master.commissionRate?.toString() || "1");
  };

  const handleSaveEdit = (masterId: string, type?: string) => {
    if (!editName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    const updatedMaster: Partial<Master> = {
      name: editName.trim()
    };

    // Only add commission rate for broker or agent types
    if ((type === "broker" || type === "agent") && editCommissionRate) {
      updatedMaster.commissionRate = parseFloat(editCommissionRate);
    }

    updateMaster(masterId, updatedMaster);
    
    setEditingId(null);
    setEditName("");
    setEditCommissionRate("");
    
    toast.success("Master updated successfully");
    onUpdate(); // Refresh the list
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditCommissionRate("");
  };

  const handleDeleteClick = (master: Master) => {
    setMasterToDelete(master);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (masterToDelete) {
      deleteMaster(masterToDelete.id);
      toast.success("Master deleted successfully");
      onUpdate();  // Refresh the list
    }
    setDeleteDialogOpen(false);
    setMasterToDelete(null);
  };

  return (
    <div className="space-y-4">
      {masters.length === 0 ? (
        <p className="text-gray-500">No masters saved yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {masters.map((master) => (
            <Card
              key={master.id}
              className="p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              {editingId === master.id ? (
                <div className="space-y-3">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="font-semibold"
                    placeholder="Enter name"
                  />
                  
                  {(master.type === "broker" || master.type === "agent") && (
                    <Input
                      type="number"
                      value={editCommissionRate}
                      onChange={(e) => setEditCommissionRate(e.target.value)}
                      className="mt-2"
                      placeholder="Commission Rate %"
                      step="0.01"
                    />
                  )}
                  
                  <div className="flex space-x-2 mt-2">
                    <Button 
                      size="sm" 
                      className="flex items-center" 
                      onClick={() => handleSaveEdit(master.id, master.type)}
                    >
                      <Check className="h-4 w-4 mr-1" /> Save
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex items-center" 
                      onClick={handleCancelEdit}
                    >
                      <X className="h-4 w-4 mr-1" /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-indigo-800">{master.name}</h3>
                      {master.type && (
                        <p className="text-xs text-gray-500 capitalize">
                          Type: {master.type}
                        </p>
                      )}
                      {(master.type === "broker" || master.type === "agent") && master.commissionRate !== undefined && (
                        <p className="text-sm text-gray-700 mt-1">
                          Commission Rate: {master.commissionRate}%
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0" 
                        onClick={() => handleEditClick(master)}
                      >
                        <Pencil className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0" 
                        onClick={() => handleDeleteClick(master)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will delete "{masterToDelete?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
