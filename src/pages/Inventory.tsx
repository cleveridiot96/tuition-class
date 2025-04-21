import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, PackageOpen, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { InventoryItem } from "@/services/types";
import { getInventory, saveInventory } from "@/services/inventoryService";
import { getPurchases, savePurchases } from "@/services/storageService";
import InventoryCard from "@/components/inventory/InventoryCard";
import { EditDialog, ZeroQtyDeleteDialog, HardDeleteDialog, RestoreDialog } from "@/components/inventory/InventoryDialogs";

const Inventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [deletedItems, setDeletedItems] = useState<InventoryItem[]>([]);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [itemBeingDeleted, setItemBeingDeleted] = useState<InventoryItem | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = () => {
    const inventoryData = getInventory();
    if (Array.isArray(inventoryData)) {
      setInventory(inventoryData.filter(item => !item.isDeleted));
      setDeletedItems(inventoryData.filter(item => item.isDeleted));
    } else {
      console.error("Inventory data is not an array:", inventoryData);
      setInventory([]);
      setDeletedItems([]);
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setEditItem({...item});
    setIsEditing(true);
  };

  const handleEditSave = () => {
    if (editItem) {
      const allInventory = [...inventory, ...deletedItems];
      const updatedInventory = allInventory.map(item => 
        item.id === editItem.id ? editItem : item
      );
      
      saveInventory(updatedInventory);
      
      setInventory(updatedInventory.filter(item => !item.isDeleted));
      setDeletedItems(updatedInventory.filter(item => item.isDeleted));
      
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
        setItemToDelete(id);
        setShowDeleteConfirm(true);
      } else {
        confirmDeleteOperation(itemToRemove);
      }
    }
  };

  const confirmDeleteOperation = (item: InventoryItem) => {
    const deletedItem = { ...item, isDeleted: true };
    const newDeletedItems = [...deletedItems, deletedItem];
    setDeletedItems(newDeletedItems);
    
    const newInventory = inventory.filter(i => i.id !== item.id);
    setInventory(newInventory);
    
    updatePurchasesForDeletedItem(item.lotNumber);
    
    const allItems = [...newInventory, ...newDeletedItems];
    saveInventory(allItems);
    
    toast({
      title: "Item Deleted",
      description: `${item.lotNumber} has been marked as deleted in inventory.`,
    });
    
    setConfirmDelete(false);
    setItemBeingDeleted(null);
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };

  const updatePurchasesForDeletedItem = (lotNumber: string) => {
    const purchases = getPurchases();
    const updatedPurchases = purchases.map(purchase => {
      if (purchase.lotNumber === lotNumber) {
        return { ...purchase, isDeleted: true };
      }
      return purchase;
    });
    
    savePurchases(updatedPurchases);
  };

  const handleRestore = (item: InventoryItem) => {
    const restoredItem = { ...item, isDeleted: false };
    const updatedInventory = [...inventory, restoredItem];
    const updatedDeletedItems = deletedItems.filter(i => i.id !== item.id);
    
    restorePurchasesForItem(item.lotNumber);
    
    setInventory(updatedInventory);
    setDeletedItems(updatedDeletedItems);
    saveInventory([...updatedInventory, ...updatedDeletedItems]);
    
    toast({
      title: "Item Restored",
      description: `${item.lotNumber} has been restored to inventory.`
    });
  };

  const restorePurchasesForItem = (lotNumber: string) => {
    const purchases = getPurchases();
    const updatedPurchases = purchases.map(purchase => {
      if (purchase.lotNumber === lotNumber) {
        const { isDeleted, ...rest } = purchase;
        return rest;
      }
      return purchase;
    });
    
    savePurchases(updatedPurchases);
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

  const refreshInventory = () => {
    loadInventory();
    toast({
      title: "Inventory Refreshed",
      description: "Inventory data has been refreshed"
    });
  };

  const chiplunStock = inventory
    .filter(item => item.location === "Chiplun")
    .reduce((total, item) => total + (item.quantity || 0), 0);
  
  const mumbaiStock = inventory
    .filter(item => item.location === "Mumbai")
    .reduce((total, item) => total + (item.quantity || 0), 0);

  return (
    <div className="min-h-screen bg-ag-beige">
      <Navigation title="Inventory" showBackButton />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold mr-4">Inventory Management</h2>
            <Button 
              onClick={refreshInventory}
              variant="outline"
              className="flex items-center gap-2"
              size="sm"
            >
              <RefreshCw size={16} />
              Refresh
            </Button>
          </div>
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
                <InventoryCard key={item.id} item={item} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="chiplun" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2">
              {inventory
                .filter(item => item.location === "Chiplun")
                .map((item) => (
                  <InventoryCard key={item.id} item={item} onEdit={handleEdit} onDelete={handleDelete} />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="mumbai" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2">
              {inventory
                .filter(item => item.location === "Mumbai")
                .map((item) => (
                  <InventoryCard key={item.id} item={item} onEdit={handleEdit} onDelete={handleDelete} />
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

      <EditDialog 
        open={isEditing}
        setOpen={(open) => setIsEditing(open)}
        editItem={editItem}
        handleInputChange={handleInputChange}
        handleEditSave={handleEditSave}
      />

      <ZeroQtyDeleteDialog
        open={showDeleteConfirm}
        setOpen={setShowDeleteConfirm}
        onDelete={() => {
          if (itemToDelete) {
            const item = inventory.find(i => i.id === itemToDelete);
            if (item) {
              confirmDeleteOperation(item);
            }
          }
        }}
        onKeep={() => setShowDeleteConfirm(false)}
        item={itemToDelete ? inventory.find(i => i.id === itemToDelete) || null : null}
      />

      <HardDeleteDialog
        open={confirmDelete}
        setOpen={setConfirmDelete}
        item={itemBeingDeleted}
        onDelete={() => {
          if (itemBeingDeleted) {
            executeDelete(itemBeingDeleted.id);
          }
        }}
      />

      <RestoreDialog 
        open={showRestoreDialog}
        setOpen={setShowRestoreDialog}
        deletedItems={deletedItems}
        onRestore={handleRestore}
      />
    </div>
  );
};

export default Inventory;
