import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Save, ArrowLeft, AlertCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { 
  Purchase, 
  getPurchases, 
  addPurchase,
  getAgents,
  updateAgentBalance,
  addInventoryItem,
  checkDuplicateLot
} from "@/services/storageService";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Purchases = () => {
  const { toast } = useToast();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [agents, setAgents] = useState<{id: string, name: string}[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [duplicateInfo, setDuplicateInfo] = useState<any>(null);
  
  const [formData, setFormData] = useState<Omit<Purchase, "id">>({
    date: new Date().toISOString().split('T')[0],
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: ["quantity", "netWeight", "rate", "totalAmount", "expenses", "totalAfterExpenses", "ratePerKgAfterExpenses"].includes(name) 
          ? Number(value) 
          : value
      };
      
      if (name === "netWeight" || name === "rate") {
        updated.totalAmount = Number(updated.netWeight) * Number(updated.rate);
      }
      
      if (name === "totalAmount" || name === "expenses") {
        updated.totalAfterExpenses = Number(updated.totalAmount) + Number(updated.expenses);
        if (updated.netWeight > 0) {
          updated.ratePerKgAfterExpenses = updated.totalAfterExpenses / updated.netWeight;
        }
      }
      
      return updated;
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const checkForDuplicateLot = () => {
    const duplicate = checkDuplicateLot(formData.lotNumber);
    if (duplicate) {
      setDuplicateInfo(duplicate);
      setShowDuplicateDialog(true);
      return true;
    }
    return false;
  };

  const handleLotNumberBlur = () => {
    if (formData.lotNumber.trim()) {
      checkForDuplicateLot();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (checkForDuplicateLot() && !window.confirm(`Lot ${formData.lotNumber} already exists. Are you sure you want to continue?`)) {
      return;
    }
    
    const newPurchase: Purchase = {
      id: Date.now().toString(),
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
    
    toast({
      title: "Purchase Added",
      description: `Lot ${formData.lotNumber} added successfully.`
    });
    
    setFormData({
      date: new Date().toISOString().split('T')[0],
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
    
    setShowForm(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-ag-beige">
        <Navigation title="Purchase" showBackButton />
        <div className="container mx-auto px-4 py-6">
          {!showForm ? (
            <>
              <div className="flex justify-end mb-6">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => setShowForm(true)}
                      className="action-button flex gap-2 items-center"
                    >
                      <PlusCircle size={24} />
                      New Purchase
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add a new purchase record</p>
                    <p className="text-sm text-muted-foreground">નવી ખરીદી રેકોર્ડ ઉમેરો</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {purchases.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="text-xl text-ag-brown">
                    No purchases found. Click the button above to add a new purchase.
                  </p>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                  {purchases.map((purchase) => (
                    <Card key={purchase.id} className="p-4">
                      <div className="flex justify-between items-center border-b pb-2 mb-2">
                        <h3 className="text-xl font-bold">{purchase.lotNumber}</h3>
                        <p className="text-ag-brown">{new Date(purchase.date).toLocaleDateString()}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="font-semibold">Quantity:</p>
                          <p>{purchase.quantity} bags</p>
                        </div>
                        <div>
                          <p className="font-semibold">Agent:</p>
                          <p>{purchase.agent}</p>
                        </div>
                        {purchase.party && (
                          <div>
                            <p className="font-semibold">Party:</p>
                            <p>{purchase.party}</p>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold">Location:</p>
                          <p>{purchase.location}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Net Weight:</p>
                          <p>{purchase.netWeight} Kg</p>
                        </div>
                        <div>
                          <p className="font-semibold">Rate:</p>
                          <p>₹{purchase.rate}/Kg</p>
                        </div>
                      </div>
                      <div className="mt-3 p-2 bg-ag-beige-light rounded-md">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="font-semibold">Total:</p>
                            <p>{formatCurrency(purchase.totalAmount)}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Expenses:</p>
                            <p>{formatCurrency(purchase.expenses)}</p>
                          </div>
                          <div>
                            <p className="font-semibold">After Expenses:</p>
                            <p>{formatCurrency(purchase.totalAfterExpenses)}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Rate/Kg After:</p>
                            <p>₹{purchase.ratePerKgAfterExpenses?.toFixed(2) || '0.00'}/Kg</p>
                          </div>
                        </div>
                      </div>
                      {purchase.notes && (
                        <p className="mt-2 text-ag-brown">
                          <span className="font-semibold">Notes:</span> {purchase.notes}
                        </p>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : (
            <Card className="form-section">
              <div className="flex items-center mb-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setShowForm(false)}
                      className="mr-2"
                    >
                      <ArrowLeft size={24} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Return to purchase list</p>
                    <p className="text-sm text-muted-foreground">ખરીદી સૂચિ પર પાછા ફરો</p>
                  </TooltipContent>
                </Tooltip>
                <h2 className="form-title">Add New Purchase</h2>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          <Label htmlFor="date" className="form-label">Date</Label>
                          <Info size={16} className="ml-1 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Date of purchase</p>
                        <p className="text-sm text-muted-foreground">ખરીદીની તારીખ</p>
                      </TooltipContent>
                    </Tooltip>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="text-lg p-6"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          <Label htmlFor="lotNumber" className="form-label">Lot Number</Label>
                          <Info size={16} className="ml-1 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Unique identifier for this purchase</p>
                        <p className="text-sm text-muted-foreground">આ ખરીદી માટે અનન્ય ઓળખકર્તા</p>
                      </TooltipContent>
                    </Tooltip>
                    <Input
                      id="lotNumber"
                      name="lotNumber"
                      placeholder="AB/10"
                      value={formData.lotNumber}
                      onChange={handleChange}
                      onBlur={handleLotNumberBlur}
                      className="text-lg p-6"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          <Label htmlFor="agent" className="form-label">Agent</Label>
                          <Info size={16} className="ml-1 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Person who arranged the purchase</p>
                        <p className="text-sm text-muted-foreground">જે વ્યક્તિએ ખરીદીની વ્યવસ્થા કરી</p>
                      </TooltipContent>
                    </Tooltip>
                    <Select
                      onValueChange={(value) => handleSelectChange("agent", value)}
                      value={formData.agent}
                    >
                      <SelectTrigger className="text-lg p-6">
                        <SelectValue placeholder="Select Agent" />
                      </SelectTrigger>
                      <SelectContent>
                        {agents.map(agent => (
                          <SelectItem key={agent.id} value={agent.name}>
                            {agent.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="form-group">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          <Label htmlFor="party" className="form-label">Party/Supplier</Label>
                          <Info size={16} className="ml-1 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Party or supplier name</p>
                        <p className="text-sm text-muted-foreground">પાર્ટી અથવા સપ્લાયરનું નામ</p>
                      </TooltipContent>
                    </Tooltip>
                    <Input
                      id="party"
                      name="party"
                      placeholder="Party name"
                      value={formData.party}
                      onChange={handleChange}
                      className="text-lg p-6"
                    />
                  </div>
                  
                  <div className="form-group">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          <Label htmlFor="quantity" className="form-label">Quantity</Label>
                          <Info size={16} className="ml-1 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Quantity of bags</p>
                        <p className="text-sm text-muted-foreground">બૈગ માંથી માત્રા</p>
                      </TooltipContent>
                    </Tooltip>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      placeholder="10"
                      value={formData.quantity || ""}
                      onChange={handleChange}
                      className="text-lg p-6"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          <Label htmlFor="netWeight" className="form-label">Net Weight</Label>
                          <Info size={16} className="ml-1 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Net weight in kilograms</p>
                        <p className="text-sm text-muted-foreground">��ુદ્ધ વજન કિલોગ્રામમાં</p>
                      </TooltipContent>
                    </Tooltip>
                    <Input
                      id="netWeight"
                      name="netWeight"
                      type="number"
                      placeholder="500"
                      value={formData.netWeight || ""}
                      onChange={handleChange}
                      className="text-lg p-6"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          <Label htmlFor="rate" className="form-label">Rate</Label>
                          <Info size={16} className="ml-1 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Rate per kilogram</p>
                        <p className="text-sm text-muted-foreground">કિલોગ્રામ માં દર</p>
                      </TooltipContent>
                    </Tooltip>
                    <Input
                      id="rate"
                      name="rate"
                      type="number"
                      step="0.01"
                      placeholder="100.00"
                      value={formData.rate || ""}
                      onChange={handleChange}
                      className="text-lg p-6"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          <Label htmlFor="location" className="form-label">Location</Label>
                          <Info size={16} className="ml-1 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Location of purchase</p>
                        <p className="text-sm text-muted-foreground">ખરીદીની સ્થાન</p>
                      </TooltipContent>
                    </Tooltip>
                    <Select
                      onValueChange={(value) => handleSelectChange("location", value)}
                      value={formData.location}
                    >
                      <SelectTrigger className="text-lg p-6">
                        <SelectValue placeholder="Select Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Chiplun">Chiplun</SelectItem>
                        <SelectItem value="Mumbai">Mumbai</SelectItem>
                        <SelectItem value="Sawantwadi">Sawantwadi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="form-group">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          <Label htmlFor="transporter" className="form-label">Transporter</Label>
                          <Info size={16} className="ml-1 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Transporter name</p>
                        <p className="text-sm text-muted-foreground">ટ્રાંસપોર્ટર નામ</p>
                      </TooltipContent>
                    </Tooltip>
                    <Input
                      id="transporter"
                      name="transporter"
                      placeholder="Transporter name"
                      value={formData.transporter}
                      onChange={handleChange}
                      className="text-lg p-6"
                    />
                  </div>
                  
                  <div className="form-group">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          <Label htmlFor="totalAmount" className="form-label">Total Amount</Label>
                          <Info size={16} className="ml-1 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Total amount of purchase</p>
                        <p className="text-sm text-muted-foreground">ખરીદીની કોશિક્ષણ</p>
                      </TooltipContent>
                    </Tooltip>
                    <Input
                      id="totalAmount"
                      name="totalAmount"
                      type="number"
                      placeholder="Calculated automatically"
                      value={formData.totalAmount || ""}
                      onChange={handleChange}
                      className="text-lg p-6 bg-gray-100"
                      readOnly
                    />
                  </div>
                  
                  <div className="form-group">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          <Label htmlFor="expenses" className="form-label">Expenses</Label>
                          <Info size={16} className="ml-1 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Expenses incurred during purchase</p>
                        <p className="text-sm text-muted-foreground">ખરીદીની પર સાચવાની ખર્ચો</p>
                      </TooltipContent>
                    </Tooltip>
                    <Input
                      id="expenses"
                      name="expenses"
                      type="number"
                      placeholder="1000"
                      value={formData.expenses || ""}
                      onChange={handleChange}
                      className="text-lg p-6"
                    />
                  </div>
                  
                  <div className="form-group">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          <Label htmlFor="totalAfterExpenses" className="form-label">Total After Expenses</Label>
                          <Info size={16} className="ml-1 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Total amount after expenses</p>
                        <p className="text-sm text-muted-foreground">ખર્ચોની બાદ કોશિક્ષણ</p>
                      </TooltipContent>
                    </Tooltip>
                    <Input
                      id="totalAfterExpenses"
                      name="totalAfterExpenses"
                      type="number"
                      placeholder="Calculated automatically"
                      value={formData.totalAfterExpenses || ""}
                      onChange={handleChange}
                      className="text-lg p-6 bg-gray-100"
                      readOnly
                    />
                  </div>
                  
                  <div className="form-group">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          <Label htmlFor="ratePerKgAfterExpenses" className="form-label">Rate/Kg After Expenses</Label>
                          <Info size={16} className="ml-1 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Rate per kilogram after expenses</p>
                        <p className="text-sm text-muted-foreground">ખર્ચોની બાદ કિલોગ્રામ માં દર</p>
                      </TooltipContent>
                    </Tooltip>
                    <Input
                      id="ratePerKgAfterExpenses"
                      name="ratePerKgAfterExpenses"
                      type="number"
                      step="0.01"
                      placeholder="Calculated automatically"
                      value={formData.ratePerKgAfterExpenses ? formData.ratePerKgAfterExpenses.toFixed(2) : ""}
                      className="text-lg p-6 bg-gray-100"
                      readOnly
                    />
                  </div>
                  
                  <div className="form-group md:col-span-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          <Label htmlFor="notes" className="form-label">Notes</Label>
                          <Info size={16} className="ml-1 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Additional notes</p>
                        <p className="text-sm text-muted-foreground">અનુભવોની નોટ્સ</p>
                      </TooltipContent>
                    </Tooltip>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Additional notes..."
                      value={formData.notes}
                      onChange={handleChange}
                      className="text-lg p-4 min-h-[100px]"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        type="submit" 
                        className="action-button flex gap-2 items-center"
                      >
                        <Save size={24} />
                        Save
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Save purchase record</p>
                      <p className="text-sm text-muted-foreground">ખરીદી રેકોર્ડ સાચવો</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </form>
            </Card>
          )}
        </div>
        
        <Dialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                Duplicate Lot Number
              </DialogTitle>
              <DialogDescription>
                {duplicateInfo && (
                  <div className="mt-2">
                    <p>This lot number <strong>{formData.lotNumber}</strong> already exists in a previous entry:</p>
                    <ul className="mt-2 list-disc pl-5">
                      <li>Date: {new Date(duplicateInfo.date).toLocaleDateString()}</li>
                      <li>Agent: {duplicateInfo.agent}</li>
                      <li>Quantity: {duplicateInfo.quantity} bags</li>
                    </ul>
                    <p className="mt-2">Do you want to continue with the same lot number?</p>
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDuplicateDialog(false)}>Continue Anyway</Button>
              <Button onClick={() => {
                setShowDuplicateDialog(false);
                document.getElementById("lotNumber")?.focus();
              }}>
                Change Lot Number
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default Purchases;
