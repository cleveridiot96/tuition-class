
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
import { Edit, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Agent {
  id: string;
  name: string;
}

const LOCATIONS = ["Mumbai", "Chiplun", "Sawantwadi", "Cold Storage"];

const Purchases = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [purchaseToDelete, setPurchaseToDelete] = useState<string | null>(null);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);
  const [formData, setFormData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    lotNumber: "",
    quantity: 0,
    agent: "",
    party: "",
    location: "",
    netWeight: 0,
    rate: 0,
    transporter: "",
    totalAmount: 0,
    expenses: 0,
    totalAfterExpenses: 0,
    ratePerKgAfterExpenses: 0,
    notes: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setPurchases(getPurchases());
    setAgents(getAgents().map(a => ({ id: a.id, name: a.name })));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    const updated = {
      ...formData,
      [name]: name === "quantity" || name === "netWeight" || name === "rate" || name === "expenses" 
        ? Number(value) 
        : value
    };
    
    if (name === "netWeight" || name === "rate") {
      updated.totalAmount = Number(updated.netWeight) * Number(updated.rate);
    }

    if (name === "totalAmount" || name === "expenses") {
      updated.totalAfterExpenses = Number(updated.totalAmount) + Number(updated.expenses);
      updated.ratePerKgAfterExpenses = updated.netWeight > 0 ? updated.totalAfterExpenses / updated.netWeight : 0;
    }

    if (name === "expenses") {
      updated.totalAfterExpenses = Number(updated.totalAmount) + Number(value);
      updated.ratePerKgAfterExpenses = updated.netWeight > 0 ? updated.totalAfterExpenses / updated.netWeight : 0;
    }
    
    setFormData(updated);
  };

  const validateForm = (isEdit = false) => {
    if (!formData.date || !formData.lotNumber || !formData.agent || formData.netWeight <= 0 || formData.rate <= 0) {
      toast.error("Please fill all required fields");
      return false;
    }

    const duplicate = checkDuplicateLot(formData.lotNumber, isEdit ? editingPurchase?.id : undefined);
    if (duplicate) {
      toast.error(`Lot number ${formData.lotNumber} already exists`);
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const newPurchase: Purchase = {
      id: Date.now().toString(),
      date: formData.date,
      lotNumber: formData.lotNumber,
      quantity: formData.quantity,
      agent: formData.agent,
      party: formData.party,
      location: formData.location,
      netWeight: formData.netWeight,
      rate: formData.rate,
      transporter: formData.transporter,
      totalAmount: formData.totalAmount,
      expenses: formData.expenses,
      totalAfterExpenses: formData.totalAfterExpenses,
      ratePerKgAfterExpenses: formData.ratePerKgAfterExpenses,
      notes: formData.notes,
    };
    
    addPurchase(newPurchase);
    
    setPurchases([newPurchase, ...purchases]);
    
    addInventoryItem({
      id: Date.now().toString() + '-inv',
      lotNumber: newPurchase.lotNumber,
      quantity: newPurchase.quantity,
      location: newPurchase.location,
      dateAdded: newPurchase.date,
      netWeight: newPurchase.netWeight
    });
    
    const agentId = getAgents().find(a => a.name === newPurchase.agent)?.id;
    if (agentId) {
      updateAgentBalance(agentId, -newPurchase.totalAfterExpenses);
    }
    
    toast.success("Purchase added successfully");
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEdit = (purchase: Purchase) => {
    setEditingPurchase(purchase);
    setFormData({
      date: purchase.date,
      lotNumber: purchase.lotNumber,
      quantity: purchase.quantity,
      agent: purchase.agent,
      party: purchase.party || "",
      location: purchase.location || "",
      netWeight: purchase.netWeight,
      rate: purchase.rate,
      transporter: purchase.transporter || "",
      totalAmount: purchase.totalAmount,
      expenses: purchase.expenses,
      totalAfterExpenses: purchase.totalAfterExpenses,
      ratePerKgAfterExpenses: purchase.ratePerKgAfterExpenses,
      notes: purchase.notes || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingPurchase || !validateForm(true)) return;
    
    const updatedPurchase: Purchase = {
      ...editingPurchase,
      date: formData.date,
      lotNumber: formData.lotNumber,
      quantity: formData.quantity,
      agent: formData.agent,
      party: formData.party,
      location: formData.location,
      netWeight: formData.netWeight,
      rate: formData.rate,
      transporter: formData.transporter,
      totalAmount: formData.totalAmount,
      expenses: formData.expenses,
      totalAfterExpenses: formData.totalAfterExpenses,
      ratePerKgAfterExpenses: formData.ratePerKgAfterExpenses,
      notes: formData.notes
    };
    
    updatePurchase(updatedPurchase);
    
    setPurchases(purchases.map(p => 
      p.id === updatedPurchase.id ? updatedPurchase : p
    ));
    
    toast.success("Purchase updated successfully");
    setIsEditDialogOpen(false);
    resetForm();
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
      
      const agentId = getAgents().find(a => a.name === purchaseToRemove.agent)?.id;
      if (agentId) {
        updateAgentBalance(agentId, purchaseToRemove.totalAfterExpenses);
      }
      
      setPurchases(purchases.filter(p => p.id !== purchaseToDelete));
      toast.success("Purchase deleted successfully");
    }
    
    setShowDeleteConfirm(false);
    setPurchaseToDelete(null);
  };

  const resetForm = () => {
    setFormData({
      date: format(new Date(), "yyyy-MM-dd"),
      lotNumber: "",
      quantity: 0,
      agent: "",
      party: "",
      location: "",
      netWeight: 0,
      rate: 0,
      transporter: "",
      totalAmount: 0,
      expenses: 0,
      totalAfterExpenses: 0,
      ratePerKgAfterExpenses: 0,
      notes: ""
    });
  };

  return (
    <div className="min-h-screen">
      <Navigation title="Purchases" showBackButton={true} />
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Purchase Entries</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Purchase</Button>
            </DialogTrigger>
            <DialogContent className="w-[90vw] max-w-[800px] max-h-[90vh] overflow-hidden p-0">
              <DialogHeader className="px-6 pt-6">
                <DialogTitle>Add New Purchase</DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[calc(90vh-130px)] px-6">
                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input 
                      type="date" 
                      id="date" 
                      name="date" 
                      value={formData.date} 
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Label htmlFor="lotNumber">Lot Number *</Label>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Unique identifier for this purchase lot</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Input 
                        type="text" 
                        id="lotNumber" 
                        name="lotNumber" 
                        value={formData.lotNumber} 
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Label htmlFor="quantity">Quantity</Label>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Number of items/bags/packages</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Input 
                        type="number" 
                        id="quantity" 
                        name="quantity" 
                        value={formData.quantity} 
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <Label htmlFor="agent">Agent *</Label>
                      <select 
                        id="agent" 
                        name="agent" 
                        className="w-full p-2 border rounded"
                        value={formData.agent} 
                        onChange={handleInputChange as any}
                        required
                      >
                        <option value="">Select Agent</option>
                        {agents.map(agent => (
                          <option key={agent.id} value={agent.name}>
                            {agent.name}
                          </option>
                        ))}
                        <option value="None">None</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="party">Party Name</Label>
                      <Input 
                        type="text" 
                        id="party" 
                        name="party" 
                        value={formData.party} 
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <Label htmlFor="location">Location</Label>
                      <select 
                        id="location" 
                        name="location" 
                        className="w-full p-2 border rounded"
                        value={formData.location} 
                        onChange={handleInputChange as any}
                      >
                        <option value="">Select Location</option>
                        {LOCATIONS.map(location => (
                          <option key={location} value={location}>
                            {location}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Label htmlFor="netWeight">Net Weight (Kg) *</Label>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Net weight in kilograms</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Input 
                        type="number" 
                        id="netWeight" 
                        name="netWeight" 
                        value={formData.netWeight} 
                        onChange={handleInputChange}
                        step="0.01"
                        required
                      />
                    </div>

                    <div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Label htmlFor="rate">Rate (per Kg) *</Label>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Price per kilogram</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Input 
                        type="number" 
                        id="rate" 
                        name="rate" 
                        value={formData.rate} 
                        onChange={handleInputChange}
                        step="0.01"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="transporter">Transporter</Label>
                      <Input 
                        type="text" 
                        id="transporter" 
                        name="transporter" 
                        value={formData.transporter} 
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Label htmlFor="totalAmount">Total Amount (₹)</Label>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Net Weight × Rate per Kg</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Input 
                        type="number" 
                        id="totalAmount" 
                        name="totalAmount" 
                        value={formData.totalAmount} 
                        readOnly
                        className="bg-gray-100"
                      />
                    </div>

                    <div>
                      <Label htmlFor="expenses">Other Expenses (₹)</Label>
                      <Input 
                        type="number" 
                        id="expenses" 
                        name="expenses" 
                        value={formData.expenses} 
                        onChange={handleInputChange}
                        step="0.01"
                      />
                    </div>

                    <div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Label htmlFor="totalAfterExpenses">Total After Expenses (₹)</Label>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Total Amount + Other Expenses</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Input 
                        type="number" 
                        id="totalAfterExpenses" 
                        name="totalAfterExpenses" 
                        value={formData.totalAfterExpenses} 
                        readOnly
                        className="bg-gray-100"
                      />
                    </div>

                    <div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Label htmlFor="ratePerKgAfterExpenses">Rate/Kg After Expenses (₹)</Label>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Total After Expenses ÷ Net Weight</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Input 
                        type="number" 
                        id="ratePerKgAfterExpenses" 
                        name="ratePerKgAfterExpenses" 
                        value={formData.ratePerKgAfterExpenses} 
                        readOnly
                        className="bg-gray-100"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <textarea 
                      id="notes" 
                      name="notes" 
                      className="w-full p-2 border rounded min-h-[100px]"
                      value={formData.notes} 
                      onChange={handleInputChange}
                    />
                  </div>
                </form>
              </ScrollArea>
              <DialogFooter className="px-6 py-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleSubmit}>Add Purchase</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="w-[90vw] max-w-[800px] max-h-[90vh] overflow-hidden p-0">
            <DialogHeader className="px-6 pt-6">
              <DialogTitle>Edit Purchase</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[calc(90vh-130px)] px-6">
              <form onSubmit={handleUpdate} className="space-y-6 py-4">
                <div>
                  <Label htmlFor="edit-date">Date</Label>
                  <Input 
                    type="date" 
                    id="edit-date" 
                    name="date" 
                    value={formData.date} 
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-lotNumber">Lot Number *</Label>
                    <Input 
                      type="text" 
                      id="edit-lotNumber" 
                      name="lotNumber" 
                      value={formData.lotNumber} 
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="edit-quantity">Quantity</Label>
                    <Input 
                      type="number" 
                      id="edit-quantity" 
                      name="quantity" 
                      value={formData.quantity} 
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-agent">Agent *</Label>
                    <select 
                      id="edit-agent" 
                      name="agent" 
                      className="w-full p-2 border rounded"
                      value={formData.agent} 
                      onChange={handleInputChange as any}
                      required
                    >
                      <option value="">Select Agent</option>
                      {agents.map(agent => (
                        <option key={agent.id} value={agent.name}>
                          {agent.name}
                        </option>
                      ))}
                      <option value="None">None</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="edit-party">Party Name</Label>
                    <Input 
                      type="text" 
                      id="edit-party" 
                      name="party" 
                      value={formData.party} 
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-location">Location</Label>
                    <select 
                      id="edit-location" 
                      name="location" 
                      className="w-full p-2 border rounded"
                      value={formData.location} 
                      onChange={handleInputChange as any}
                    >
                      <option value="">Select Location</option>
                      {LOCATIONS.map(location => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="edit-netWeight">Net Weight (Kg) *</Label>
                    <Input 
                      type="number" 
                      id="edit-netWeight" 
                      name="netWeight" 
                      value={formData.netWeight} 
                      onChange={handleInputChange}
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-rate">Rate (per Kg) *</Label>
                    <Input 
                      type="number" 
                      id="edit-rate" 
                      name="rate" 
                      value={formData.rate} 
                      onChange={handleInputChange}
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-transporter">Transporter</Label>
                    <Input 
                      type="text" 
                      id="edit-transporter" 
                      name="transporter" 
                      value={formData.transporter} 
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-totalAmount">Total Amount (₹)</Label>
                    <Input 
                      type="number" 
                      id="edit-totalAmount" 
                      name="totalAmount" 
                      value={formData.totalAmount} 
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-expenses">Other Expenses (₹)</Label>
                    <Input 
                      type="number" 
                      id="edit-expenses" 
                      name="expenses" 
                      value={formData.expenses} 
                      onChange={handleInputChange}
                      step="0.01"
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-totalAfterExpenses">Total After Expenses (₹)</Label>
                    <Input 
                      type="number" 
                      id="edit-totalAfterExpenses" 
                      name="totalAfterExpenses" 
                      value={formData.totalAfterExpenses} 
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-ratePerKgAfterExpenses">Rate/Kg After Expenses (₹)</Label>
                    <Input 
                      type="number" 
                      id="edit-ratePerKgAfterExpenses" 
                      name="ratePerKgAfterExpenses" 
                      value={formData.ratePerKgAfterExpenses} 
                      readOnly
                      className="bg-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-notes">Notes</Label>
                  <textarea 
                    id="edit-notes" 
                    name="notes" 
                    className="w-full p-2 border rounded min-h-[100px]"
                    value={formData.notes} 
                    onChange={handleInputChange}
                  />
                </div>
              </form>
            </ScrollArea>
            <DialogFooter className="px-6 py-4 border-t">
              <Button type="button" variant="outline" onClick={() => {
                setIsEditDialogOpen(false);
                resetForm();
                setEditingPurchase(null);
              }}>
                Cancel
              </Button>
              <Button type="button" onClick={handleUpdate}>Update Purchase</Button>
            </DialogFooter>
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
            purchases.map((purchase) => (
              <div key={purchase.id} className="bg-white p-4 rounded-md shadow">
                <div className="flex flex-col lg:flex-row lg:justify-between">
                  <div className="mb-4 lg:mb-0">
                    <div className="font-bold text-lg">{purchase.lotNumber}</div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(purchase.date), "dd MMM yyyy")}
                    </div>
                    <div>Agent: {purchase.agent}</div>
                    {purchase.party && <div>Party: {purchase.party}</div>}
                    <div>Location: {purchase.location || "N/A"}</div>
                    <div>Transporter: {purchase.transporter || "N/A"}</div>
                  </div>

                  <div className="mb-4 lg:mb-0">
                    <div>Quantity: {purchase.quantity}</div>
                    <div>Net Weight: {purchase.netWeight} Kg</div>
                    <div>Rate: ₹{purchase.rate}/Kg</div>
                    <div>Amount: ₹{purchase.totalAmount}</div>
                  </div>

                  <div className="mb-4 lg:mb-0">
                    <div>Expenses: ₹{purchase.expenses}</div>
                    <div className="flex flex-col">
                      <div className="font-semibold">Total: ₹{purchase.totalAfterExpenses}</div>
                      <div>
                        <p className="font-semibold">Rate/Kg After:</p>
                        <p>₹{purchase.ratePerKgAfterExpenses?.toFixed(2) || '0.00'}/Kg</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 items-start">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEdit(purchase)}
                    >
                      <Edit size={18} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => confirmDeletePurchase(purchase.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>

                {purchase.notes && (
                  <div className="mt-2 pt-2 border-t">
                    <div className="font-semibold">Notes:</div>
                    <p className="text-gray-700">{purchase.notes}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Purchases;
