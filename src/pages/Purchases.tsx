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
  DialogTrigger 
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { toast } from "sonner";
import { 
  getPurchases, 
  addPurchase, 
  getAgents, 
  updateAgentBalance,
  addInventoryItem,
  checkDuplicateLot,
  Purchase 
} from "@/services/storageService";

interface Agent {
  id: string;
  name: string;
}

const Purchases = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
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
    setPurchases(getPurchases());
    setAgents(getAgents().map(a => ({ id: a.id, name: a.name })));
  }, []);

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

  const validateForm = () => {
    if (!formData.date || !formData.lotNumber || !formData.agent || formData.netWeight <= 0 || formData.rate <= 0) {
      toast.error("Please fill all required fields");
      return false;
    }

    const duplicate = checkDuplicateLot(formData.lotNumber);
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
      ...formData
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
            {/* Purchase form dialog */}
            <DialogContent className="sm:max-w-[725px]">
              <DialogHeader>
                <DialogTitle>Add New Purchase</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date selection */}
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

                <div className="grid grid-cols-2 gap-4">
                  {/* Lot Number */}
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
                  
                  {/* Quantity */}
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

                  {/* Agent */}
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
                    </select>
                  </div>

                  {/* Party Name */}
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

                  {/* Location */}
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      type="text" 
                      id="location" 
                      name="location" 
                      value={formData.location} 
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Net Weight */}
                  <div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Label htmlFor="netWeight">Net Weight (Kg) *</Label>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Net weight in kilograms</p>
                          <p className="text-sm text-muted-foreground">Net weight in kilograms</p>
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

                  {/* Rate */}
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

                  {/* Transporter */}
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

                  {/* Total Amount (calculated) */}
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

                  {/* Other Expenses */}
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

                  {/* Total after expenses (calculated) */}
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

                  {/* Rate per KG after expenses (calculated) */}
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

                {/* Notes */}
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

                {/* Form Actions */}
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Purchase</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Purchases List */}
        <div className="space-y-4">
          {purchases.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No purchases recorded yet. Add your first purchase.</p>
          ) : (
            purchases.map((purchase) => (
              <div key={purchase.id} className="bg-white p-4 rounded-md shadow">
                <div className="flex flex-col lg:flex-row lg:justify-between">
                  {/* Purchase Info */}
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

                  {/* Quantity & Weight Info */}
                  <div className="mb-4 lg:mb-0">
                    <div>Quantity: {purchase.quantity}</div>
                    <div>Net Weight: {purchase.netWeight} Kg</div>
                    <div>Rate: ₹{purchase.rate}/Kg</div>
                    <div>Amount: ₹{purchase.totalAmount}</div>
                  </div>

                  {/* Expense & Total Info */}
                  <div>
                    <div>Expenses: ₹{purchase.expenses}</div>
                    <div className="flex flex-col">
                      <div className="font-semibold">Total: ₹{purchase.totalAfterExpenses}</div>
                      <div>
                        <p className="font-semibold">Rate/Kg After:</p>
                        <p>₹{purchase.ratePerKgAfterExpenses?.toFixed(2) || '0.00'}/Kg</p>
                      </div>
                    </div>
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
