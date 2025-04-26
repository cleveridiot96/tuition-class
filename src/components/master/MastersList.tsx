
import React, { useState } from "react";
import { toast } from "sonner";
import { updateMaster, deleteMaster } from "@/services/masterService";
import { Master, MasterType } from "@/types/master.types";
import MasterCard from "./components/MasterCard";
import EditMasterForm from "./components/EditMasterForm";
import DeleteConfirmDialog from "./components/DeleteConfirmDialog";

interface MastersListProps {
  masters: Master[];
  onUpdate: () => void;
}

export const MastersList: React.FC<MastersListProps> = ({ masters, onUpdate }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editType, setEditType] = useState<MasterType>("supplier");
  const [editCommissionRate, setEditCommissionRate] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [masterToDelete, setMasterToDelete] = useState<Master | null>(null);

  // Remove duplicates by ID and filter out deleted items
  const uniqueMasters = masters
    .filter(m => !m.isDeleted)
    .reduce((acc: Master[], current) => {
      const isDuplicate = acc.find(item => item.id === current.id);
      return isDuplicate ? acc : [...acc, current];
    }, []);

  const handleEditClick = (master: Master) => {
    setEditingId(master.id);
    setEditName(master.name);
    setEditType(master.type);
    setEditCommissionRate(master.commissionRate?.toString() || "1");
  };

  const handleSaveEdit = (masterId: string) => {
    if (!editName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    const updatedMaster: Partial<Master> = {
      name: editName.trim(),
      type: editType
    };

    if ((editType === "broker" || editType === "agent") && editCommissionRate) {
      updatedMaster.commissionRate = parseFloat(editCommissionRate);
    }

    updateMaster(masterId, updatedMaster);
    
    setEditingId(null);
    setEditName("");
    setEditType("supplier");
    setEditCommissionRate("");
    
    toast.success("Master updated successfully");
    onUpdate();
  };

  const handleDeleteClick = (master: Master) => {
    setMasterToDelete(master);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (masterToDelete) {
      deleteMaster(masterToDelete.id);
      toast.success("Master deleted successfully");
      onUpdate();
    }
    setDeleteDialogOpen(false);
    setMasterToDelete(null);
  };

  return (
    <div className="space-y-4">
      {uniqueMasters.length === 0 ? (
        <p className="text-gray-500">No masters saved yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {uniqueMasters.map((master) => (
            <div key={master.id}>
              {editingId === master.id ? (
                <EditMasterForm
                  editName={editName}
                  editType={editType}
                  editCommissionRate={editCommissionRate}
                  master={master}
                  onNameChange={setEditName}
                  onTypeChange={setEditType}
                  onCommissionRateChange={setEditCommissionRate}
                  onSave={handleSaveEdit}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <MasterCard
                  master={master}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        masterToDelete={masterToDelete}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
      />
    </div>
  );
};
