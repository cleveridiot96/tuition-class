
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InventoryItem } from "@/services/types";

// Edit Dialog Props and component
export const EditDialog = ({
  open,
  setOpen,
  editItem,
  handleInputChange,
  handleEditSave
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  editItem: InventoryItem | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEditSave: () => void;
}) => (
  <Dialog open={open} onOpenChange={val => !val && setOpen(false)}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Inventory Item</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="lotNumber" className="text-right">Lot Number</Label>
          <Input id="lotNumber" name="lotNumber" value={editItem?.lotNumber || ""} onChange={handleInputChange} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="quantity" className="text-right">Quantity</Label>
          <Input id="quantity" name="quantity" type="number" value={editItem?.quantity || 0} onChange={handleInputChange} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="location" className="text-right">Location</Label>
          <Input id="location" name="location" value={editItem?.location || ""} onChange={handleInputChange} className="col-span-3" />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={handleEditSave}>Save Changes</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// Delete with zero confirmation
export const ZeroQtyDeleteDialog = ({
  open, setOpen, onDelete, onKeep, item
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onDelete: () => void;
  onKeep: () => void;
  item: InventoryItem | null;
}) => (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogDescription>This item has zero quantity. Do you want to keep it in inventory or delete it?</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={onKeep}>Keep</Button>
        <Button variant="destructive" onClick={onDelete}>Delete</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// Hard Confirm Delete Dialog
export const HardDeleteDialog = ({
  open, setOpen, item, onDelete
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  item: InventoryItem | null;
  onDelete: () => void;
}) => (
  <AlertDialog open={open} onOpenChange={setOpen}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to delete {item?.lotNumber}? This action cannot be undone.
          {item && item.quantity > 0 && (
            <div className="text-red-500 mt-2 font-semibold">
              Warning: This item still has {item.quantity} bags in stock!
            </div>
          )}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

// Restore Deleted Items Dialog
export const RestoreDialog = ({
  open, setOpen, deletedItems, onRestore
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  deletedItems: InventoryItem[];
  onRestore: (item: InventoryItem) => void;
}) => (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader><DialogTitle>Restore Deleted Items</DialogTitle></DialogHeader>
      <div className="max-h-[300px] overflow-y-auto">
        {deletedItems.length > 0 ? (
          deletedItems.map(item => (
            <div key={item.id} className="flex justify-between items-center py-2 border-b">
              <div>
                <p className="font-medium">{item.lotNumber}</p>
                <p className="text-sm text-gray-500">{item.quantity} bags, {item.location}</p>
              </div>
              <Button size="sm" onClick={() => onRestore(item)}>Restore</Button>
            </div>
          ))
        ) : (
          <p className="text-center py-4">No deleted items to restore</p>
        )}
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
