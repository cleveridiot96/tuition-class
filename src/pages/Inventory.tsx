import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, PackageOpen, Edit, Trash2, AlertTriangle } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface InventoryItem {
  id: string;
  lotNumber: string;
  quantity: number;
  location: string;
  dateAdded: string;
}

const Inventory = () => {
  // Mock inventory data
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: "1",
      lotNumber: "AB/10",
      quantity: 7,
      location: "Chiplun",
      dateAdded: "2025-04-01"
    },
    {
      id: "2",
      lotNumber: "CD/5",
      quantity: 3,
      location: "Mumbai",
      dateAdded: "2025-04-02"
    },
    {
      id: "3",
      lotNumber: "EF/8",
      quantity: 5,
      location: "Chiplun",
      dateAdded: "2025-04-03"
    },
    {
      id: "4",
      lotNumber: "GH/12",
      quantity: 8,
      location: "Mumbai",
      dateAdded: "2025-04-05"
    }
  ]);

  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [deletedItems, setDeletedItems] = useState<InventoryItem[]>([]);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [itemBeingDeleted, setItemBeingDeleted] = useState<InventoryItem | null>(null);
  const { toast } = useToast();

  const handleEdit = (item: InventoryItem) => {
    setEditItem({...item});
    setIsEditing(true);
  };

  const handleEditSave = () => {
    if (editItem) {
      setInventory(prev => 
        prev.map(item => 
          item.id === editItem.id ? editItem : item
        )
      );
      setIsEditing(false);
      setEditItem(null);
      toast({
        title: "Inventory Updated",
        description: `Item ${editItem.lotNumber} has been updated successfully.`
      });
    }
  };

  const handleDelete = (id: string) => {
    const item = inventory.find(i => i.id === id);
    if (item) {
      setItemBeingDeleted(item);
      setConfirmDelete(true);
    }
  };

  const executeDelete = (id: string) => {
    const itemToRemove = inventory.find(item => item.id === id);
    if (itemToRemove) {
      if (itemToRemove.quantity <= 0) {
        // If quantity is zero, ask if they want to keep or delete
        setItemToDelete(id);
        setShowDeleteConfirm(true);
      } else {
        // If quantity is not zero, directly add to deletedItems and remove from inventory
        confirmDeleteOperation(itemToRemove);
      }
    }
  };

  const confirmDeleteOperation = (item: InventoryItem) => {
    setDeletedItems(prev => [...prev, item]);
    setInventory(prev => prev.filter(i => i.id !== item.id));
    toast({
      title: "Item Deleted",
      description: `${item.lotNumber} has been removed from inventory.`,
    });
    setConfirmDelete(false);
    setItemBeingDeleted(null);
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };

  const handleRestore = (item: InventoryItem) => {
    setInventory(prev => [...prev, item]);
    setDeletedItems(prev => prev.filter(i => i.id !== item.id));
    toast({
      title: "Item Restored",
      description: `${item.lotNumber} has been restored to inventory.`
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editItem) {
      const { name, value } = e.target;
      setEditItem({
        ...editItem,
        [name]: name === 'quantity' ? parseInt(value, 10) : value
      });
    }
  };

  // Calculate total stock by location
  const chiplunStock = inventory
    .filter(item => item.location === "Chiplun")
    .reduce((total, item) => total + item.quantity, 0);
  
  const mumbaiStock = inventory
    .filter(item => item.location === "Mumbai")
    .reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-ag-beige">
      <Navigation title="Inventory" showBackButton />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Inventory Management</h2>
          <Button 
            onClick={() => setShowRestoreDialog(true)}
            variant="outline"
            className="flex items-center gap-2"
            disabled={deletedItems.length === 0}
          >
            Restore Deleted Items ({deletedItems.length})
          </Button>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="all" className="text-lg py-3">All</TabsTrigger>
            <TabsTrigger value="chiplun" className="text-lg py-3">Chiplun</TabsTrigger>
            <TabsTrigger value="mumbai" className="text-lg py-3">Mumbai</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2">
              {inventory.map((item) => (
                <InventoryCard 
                  key={item.id} 
                  item={item} 
                  onEdit={handleEdit} 
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="chiplun" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2">
              {inventory
                .filter(item => item.location === "Chiplun")
                .map((item) => (
                  <InventoryCard 
                    key={item.id} 
                    item={item} 
                    onEdit={handleEdit} 
                    onDelete={handleDelete}
                  />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="mumbai" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2">
              {inventory
                .filter(item => item.location === "Mumbai")
                .map((item) => (
                  <InventoryCard 
                    key={item.id} 
                    item={item} 
                    onEdit={handleEdit} 
                    onDelete={handleDelete}
                  />
                ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 text-ag-brown-dark">Total Stock Summary</h3>
          <div className="grid grid-cols-2 gap-6">
            <Card className="p-4 flex items-center border-2 border-ag-green-light">
              <div className="mr-4 bg-ag-green-light p-3 rounded-full">
                <PackageOpen size={32} className="text-ag-green" />
              </div>
              <div>
                <p className="text-sm text-ag-brown">Stock in Chiplun</p>
                <p className="text-2xl font-bold">{chiplunStock} bags</p>
              </div>
            </Card>
            <Card className="p-4 flex items-center border-2 border-ag-orange-light">
              <div className="mr-4 bg-ag-orange-light p-3 rounded-full">
                <Package size={32} className="text-ag-orange" />
              </div>
              <div>
                <p className="text-sm text-ag-brown">Stock in Mumbai</p>
                <p className="text-2xl font-bold">{mumbaiStock} bags</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={(open) => !open && setIsEditing(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Inventory Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lotNumber" className="text-right">
                Lot Number
              </Label>
              <Input
                id="lotNumber"
                name="lotNumber"
                value={editItem?.lotNumber || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={editItem?.quantity || 0}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                name="location"
                value={editItem?.location || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              This item has zero quantity. Do you want to keep it in inventory or delete it?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Keep
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (itemToDelete) {
                  const item = inventory.find(i => i.id === itemToDelete);
                  if (item) {
                    confirmDeleteOperation(item);
                  }
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* General Delete Confirmation */}
      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {itemBeingDeleted?.lotNumber}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setConfirmDelete(false);
              setItemBeingDeleted(null);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (itemBeingDeleted) {
                executeDelete(itemBeingDeleted.id);
              }
            }}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Restore Dialog */}
      <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Restore Deleted Items</DialogTitle>
          </DialogHeader>
          <div className="max-h-[300px] overflow-y-auto">
            {deletedItems.length > 0 ? (
              deletedItems.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">{item.lotNumber}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} bags, {item.location}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleRestore(item)}
                  >
                    Restore
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center py-4">No deleted items to restore</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRestoreDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface InventoryCardProps {
  item: InventoryItem;
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
}

const InventoryCard = ({ item, onEdit, onDelete }: InventoryCardProps) => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-center border-b pb-2 mb-2">
        <h3 className="text-xl font-bold">{item.lotNumber}</h3>
        <span className={`px-3 py-1 rounded-full text-white ${
          item.location === "Chiplun" ? "bg-ag-green" : "bg-ag-orange"
        }`}>
          {item.location}
        </span>
      </div>
      <div className="mt-2">
        <p className="text-2xl font-bold">{item.quantity} bags</p>
        <p className="text-ag-brown text-sm mt-1">
          Added on: {new Date(item.dateAdded).toLocaleDateString()}
        </p>
      </div>
      <div className="mt-4 flex space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 flex items-center justify-center"
          onClick={() => onEdit(item)}
        >
          <Edit size={16} className="mr-1" /> Edit
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 flex items-center justify-center text-red-500 hover:text-red-700"
          onClick={() => onDelete(item.id)}
        >
          <Trash2 size={16} className="mr-1" /> Delete
        </Button>
      </div>
    </Card>
  );
};

export default Inventory;
