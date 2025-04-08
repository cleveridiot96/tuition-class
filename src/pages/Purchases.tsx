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
  Purchase,
  addSale
} from "@/services/storageService";
import { Edit, Trash2, RefreshCw, Plus, CheckCircle } from "lucide-react";
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
import { formatDate } from "@/utils/helpers";

const Purchases = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [purchaseToDelete, setPurchaseToDelete] = useState<string | null>(null);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDemoSuccess, setShowDemoSuccess] = useState(false);

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

  const addDemoTransaction = () => {
    const purchaseDate = new Date().toISOString().split('T')[0];
    const purchaseId = "purchase-ab6-" + Date.now().toString();
    const lotNumber = "AB/6";
    
    const arAgentId = "agent-001"; // Assuming this is the ID of AR Agent
    const sudhaTransporterId = "transporter-001"; // Assuming this is the ID of SUDHA transporter
    
    const bagsQuantity = 6;
    const weightPerBag = 50;
    const totalWeight = 300; // 300 KGS as specified
    const ratePerKg = 320; // Example rate, can be adjusted
    const transportRatePerKg = 17;
    const transportCost = totalWeight * transportRatePerKg;
    const totalAmountBeforeTransport = totalWeight * ratePerKg;
    const totalPurchaseAmount = totalAmountBeforeTransport + transportCost;
    
    // Create purchase
    const purchase = {
      id: purchaseId,
      date: purchaseDate,
      lotNumber: lotNumber,
      quantity: bagsQuantity,
      agent: "AR Agent",
      agentId: arAgentId,
      party: "AR Agent",
      partyId: arAgentId,
      location: "Mumbai",
      netWeight: totalWeight,
      rate: ratePerKg,
      transporter: "SUDHA",
      transporterId: sudhaTransporterId,
      transportRate: transportRatePerKg,
      transportCost: transportCost,
      totalAmount: totalAmountBeforeTransport,
      expenses: 0,
      totalAfterExpenses: totalPurchaseAmount,
      ratePerKgAfterExpenses: totalPurchaseAmount / totalWeight,
      notes: "Purchase of lot AB/6, 300 KGS from AR Agent via SUDHA transporter"
    };
    
    // Add the purchase
    addPurchase(purchase);
    
    // Generate unique sale ID
    const saleId = "sale-ab6-" + Date.now().toString();
    const saleDate = purchaseDate;
    const saleRatePerKg = 430;
    const saleTotalAmount = totalWeight * saleRatePerKg;
    
    // Create sale to MST (directly, no broker)
    const sale = {
      id: saleId,
      date: saleDate,
      lotNumber: lotNumber,
      billNumber: "",
      billAmount: saleTotalAmount,
      customer: "MST",
      customerId: "customer-mst-" + Date.now().toString(), // Creating a new customer if needed
      broker: "",
      brokerId: "",
      quantity: bagsQuantity,
      netWeight: totalWeight,
      rate: saleRatePerKg,
      transporter: "Self",
      transporterId: "",
      transportRate: 0,
      transportCost: 0,
      totalAmount: saleTotalAmount,
      netAmount: saleTotalAmount,
      amount: saleTotalAmount,
      location: "Mumbai",
      notes: "Sale of AB/6, 300 KGS to MST directly @430 per kg, no bill"
    };
    
    // Add the sale
    addSale(sale);
    
    // Refresh data and show success message
    loadData();
    setShowDemoSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => setShowDemoSuccess(false), 3000);
    
    toast.success("Demo transaction added successfully!");
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
            <Button
              variant="outline"
              onClick={addDemoTransaction}
              className="mr-2"
            >
              Add Demo Transaction
            </Button>
            {showDemoSuccess && (
              <div className="flex items-center text-green-600">
                <CheckCircle size={18} className="mr-1" />
                <span>Transaction added!</span>
              </div>
            )}
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
                        <TableCell>{formatDate(purchase.date)}</TableCell>
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
