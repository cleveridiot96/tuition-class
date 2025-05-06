
import React, { useState, useEffect, useCallback } from "react";
import Navigation from "@/components/Navigation";
import PurchaseTable from "@/components/purchases/PurchaseTable";
import PurchaseForm from "@/components/PurchaseForm";
import MultiItemPurchaseForm from "@/components/purchases/MultiItemPurchaseForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getPurchases, savePurchases } from "@/services/storageService";
import { useMasterData } from "@/hooks/useMasterData";
import { Purchase } from "@/services/types";
import AddSupplierDialog from "@/components/purchases/AddSupplierDialog";
import { toast } from "sonner";

const Purchases = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);
  const [newSupplierName, setNewSupplierName] = useState("");
  const [newSupplierAddress, setNewSupplierAddress] = useState("");
  const [showAddSupplierDialog, setShowAddSupplierDialog] = useState(false);
  const [sortColumn, setSortColumn] = useState<keyof Purchase | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isMultiItemForm, setIsMultiItemForm] = useState(false);
  
  // Use the master data hook to access suppliers, agents, etc.
  const { suppliers, agents, transporters, refresh: refreshMasterData } = useMasterData();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = () => {
    const storedPurchases = getPurchases();
    setPurchases(storedPurchases.filter(p => !p.isDeleted));
    
    // Also refresh the master data to ensure we have the latest
    refreshMasterData();
  };

  const handleAddNewSupplier = () => {
    if (newSupplierName.trim() === "") {
      toast.error('Supplier name cannot be empty.');
      return;
    }

    const newSupplier = {
      id: Date.now().toString(),
      name: newSupplierName,
      address: newSupplierAddress,
    };

    // Cannot use saveSuppliers as it doesn't exist, use direct storage operation
    localStorage.setItem('suppliers', JSON.stringify([...suppliers, newSupplier]));

    setNewSupplierName("");
    setNewSupplierAddress("");
    setShowAddSupplierDialog(false);
    
    // Refresh master data to include the new supplier
    refreshMasterData();

    toast.success("New supplier added successfully!");
  };

  const handlePurchaseSubmit = (purchaseData: Purchase) => {
    // Validate that either supplier or agent is filled
    if (!purchaseData.party && !purchaseData.agentId) {
      toast.error("Either Supplier Name or Agent must be specified");
      return;
    }

    const updatedPurchases = editingPurchase
      ? purchases.map((p) => (p.id === purchaseData.id ? purchaseData : p))
      : [...purchases, purchaseData];

    setPurchases(updatedPurchases);
    savePurchases(updatedPurchases);
    setIsAdding(false);
    setEditingPurchase(null);
    setIsMultiItemForm(false);
    toast.success(editingPurchase ? "Purchase updated!" : "Purchase added!");
  };

  const handlePurchaseDelete = (id: string) => {
    const updatedPurchases = purchases.map(purchase =>
      purchase.id === id ? { ...purchase, isDeleted: true } : purchase
    );
    setPurchases(updatedPurchases);
    savePurchases(updatedPurchases);
    toast.success("Purchase deleted!");
  };

  const handleEditPurchase = (purchase: Purchase) => {
    setEditingPurchase(purchase);
    setIsAdding(true);
  };

  const handleSort = (column: keyof Purchase) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedPurchases = useCallback(() => {
    if (!sortColumn) return [...purchases];

    const sorted = [...purchases].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue === undefined || aValue === null) return -1;
      if (bValue === undefined || bValue === null) return 1;

      const comparison = (aValue > bValue ? 1 : aValue < bValue ? -1 : 0);
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [purchases, sortColumn, sortDirection]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <Navigation title="Purchases" showBackButton pageType="purchases" />
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-gradient-to-br from-purple-100 to-purple-200 border-purple-200 shadow">
          <CardHeader>
            <CardTitle className="text-purple-800">Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <Button onClick={() => {
                setIsAdding(true);
                setIsMultiItemForm(false);
              }} className="md-ripple bg-purple-500 text-white hover:bg-purple-700">
                <Plus className="mr-2" size={16} /> Add Purchase
              </Button>
              <Button onClick={() => {
                setIsMultiItemForm(true);
                setIsAdding(true);
              }} className="md-ripple bg-purple-500 text-white hover:bg-purple-700">
                <Plus className="mr-2" size={16} /> Add Multi-Item Purchase
              </Button>
            </div>

            {isAdding ? (
              isMultiItemForm ? (
                <MultiItemPurchaseForm
                  onSubmit={handlePurchaseSubmit}
                  onCancel={() => {
                    setIsMultiItemForm(false);
                    setIsAdding(false);
                    setEditingPurchase(null);
                  }}
                  initialValues={editingPurchase}
                />
              ) : (
                <PurchaseForm
                  onSubmit={handlePurchaseSubmit}
                  onCancel={() => {
                    setIsAdding(false);
                    setEditingPurchase(null);
                  }}
                  initialData={editingPurchase}
                />
              )
            ) : (
              <PurchaseTable
                purchases={sortedPurchases()}
                onDelete={handlePurchaseDelete}
                onEdit={handleEditPurchase}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <AddSupplierDialog
        open={showAddSupplierDialog}
        onOpenChange={setShowAddSupplierDialog}
        newPartyName={newSupplierName}
        setNewPartyName={setNewSupplierName}
        newPartyAddress={newSupplierAddress}
        setNewPartyAddress={setNewSupplierAddress}
        handleAddNewParty={handleAddNewSupplier}
      />
    </div>
  );
};

export default Purchases;
