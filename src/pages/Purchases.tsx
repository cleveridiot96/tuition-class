
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogTrigger 
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
import { format } from "date-fns";
import { toast } from "sonner";
import { 
  getPurchases, 
  addPurchase,
  updatePurchase,
  deletePurchase,
  getAgents, 
  updateAgentBalance,
  addInventoryItem,
  checkDuplicateLot,
  Purchase
} from "@/services/storageService";
import { Edit, Trash2, RefreshCw, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import PurchaseForm from "@/components/PurchaseForm";
import { 
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";

const Purchases = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [purchaseToDelete, setPurchaseToDelete] = useState<string | null>(null);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setIsRefreshing(true);
    
    const freshPurchases = getPurchases().filter(p => !p.isDeleted);
    setPurchases(freshPurchases);
    
    setIsRefreshing(false);
    console.log("Purchases data refreshed:", freshPurchases);
  };

  const handleAdd = (data: Purchase) => {
    addPurchase(data);
    
    // Add to inventory
    addInventoryItem({
      id: Date.now().toString() + '-inv',
      lotNumber: data.lotNumber,
      quantity: data.quantity,
      location: data.location,
      dateAdded: data.date,
      netWeight: data.netWeight
    });
    
    // Update agent balance if applicable
    if (data.agent && data.agent !== "None") {
      const agents = getAgents();
      const agent = agents.find(a => a.name === data.agent);
      if (agent) {
        updateAgentBalance(agent.id, -data.totalAfterExpenses);
      }
    }
    
    loadData();
    toast.success("Purchase added successfully");
    setIsAddDialogOpen(false);
  };

  const handleEdit = (purchase: Purchase) => {
    // Create a copy of the purchase with properly mapped fields
    const purchaseToEdit = {
      ...purchase,
      // If using PurchaseForm expects agentId instead of agent name
      agentId: purchase.agent !== "None" ? 
        getAgents().find(a => a.name === purchase.agent)?.id || "" : "",
      transporterId: getAgents().find(t => t.name === purchase.transporter)?.id || ""
    };
    
    setEditingPurchase(purchaseToEdit);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (updatedPurchase: Purchase) => {
    if (!editingPurchase) return;
    
    // Update purchase in storage
    updatePurchase(updatedPurchase);
    
    // Refresh data
    loadData();
    
    toast.success("Purchase updated successfully");
    setIsEditDialogOpen(false);
    setEditingPurchase(null);
  };

  const confirmDeletePurchase = (id: string) => {
    setPurchaseToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = () => {
    if (!purchaseToDelete) return;
    
    const purchaseToRemove = purchases.find(p => p.id === purchaseToDelete);
    if (purchaseToRemove) {
      deletePurchase(purchaseToDelete);
      
      if (purchaseToRemove.agent && purchaseToRemove.agent !== "None") {
        const agents = getAgents();
        const agent = agents.find(a => a.name === purchaseToRemove.agent);
        if (agent) {
          updateAgentBalance(agent.id, purchaseToRemove.totalAfterExpenses);
        }
      }
      
      loadData();
      
      toast.success("Purchase deleted successfully");
    }
    
    setShowDeleteConfirm(false);
    setPurchaseToDelete(null);
  };

  return (
    <div className="min-h-screen">
      <Navigation title="Purchases" showBackButton={true} />
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Purchase Entries</h1>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={loadData}
              disabled={isRefreshing}
              title="Refresh data"
              className="mr-2"
            >
              <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus size={18} className="mr-1" /> Add Purchase
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90vw] max-w-[900px] max-h-[90vh] overflow-hidden p-0">
                <DialogHeader className="px-6 pt-6">
                  <DialogTitle>Add New Purchase</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[calc(90vh-130px)] px-6 py-4">
                  <PurchaseForm onSubmit={handleAdd} />
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setEditingPurchase(null);
        }}>
          <DialogContent className="w-[90vw] max-w-[900px] max-h-[90vh] overflow-hidden p-0">
            <DialogHeader className="px-6 pt-6">
              <DialogTitle>Edit Purchase</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[calc(90vh-130px)] px-6 py-4">
              {editingPurchase && <PurchaseForm onSubmit={handleUpdate} initialData={editingPurchase} />}
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this purchase? This action cannot be undone.
                This will update inventory and agent balances accordingly.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setShowDeleteConfirm(false);
                setPurchaseToDelete(null);
              }}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="space-y-4">
          {purchases.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No purchases recorded yet. Add your first purchase.</p>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <ScrollArea className="h-[calc(100vh-220px)]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky top-0 bg-white">Lot Number</TableHead>
                      <TableHead className="sticky top-0 bg-white">Date</TableHead>
                      <TableHead className="sticky top-0 bg-white">Agent</TableHead>
                      <TableHead className="sticky top-0 bg-white">Party</TableHead>
                      <TableHead className="sticky top-0 bg-white">Location</TableHead>
                      <TableHead className="sticky top-0 bg-white">Quantity</TableHead>
                      <TableHead className="sticky top-0 bg-white">Net Weight (kg)</TableHead>
                      <TableHead className="sticky top-0 bg-white">Rate (₹/kg)</TableHead>
                      <TableHead className="sticky top-0 bg-white">Amount (₹)</TableHead>
                      <TableHead className="sticky top-0 bg-white">Total After Exp. (₹)</TableHead>
                      <TableHead className="sticky top-0 bg-white">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchases.map((purchase) => (
                      <TableRow key={purchase.id}>
                        <TableCell className="font-medium">{purchase.lotNumber}</TableCell>
                        <TableCell>{format(new Date(purchase.date), "dd MMM yyyy")}</TableCell>
                        <TableCell>{purchase.agent || "None"}</TableCell>
                        <TableCell>{purchase.party || "-"}</TableCell>
                        <TableCell>{purchase.location || "-"}</TableCell>
                        <TableCell>{purchase.quantity}</TableCell>
                        <TableCell>{purchase.netWeight}</TableCell>
                        <TableCell>{purchase.rate}</TableCell>
                        <TableCell>{purchase.totalAmount.toFixed(2)}</TableCell>
                        <TableCell>{purchase.totalAfterExpenses.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEdit(purchase)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => confirmDeletePurchase(purchase.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Purchases;
