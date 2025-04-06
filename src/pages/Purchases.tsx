
import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Save, ArrowLeft, AlertCircle } from "lucide-react";
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

  // Load purchases and agents on component mount
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
      
      // Calculate dependent fields
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
    
    // Add the purchase to storage
    addPurchase(newPurchase);
    
    // Update the list in UI
    setPurchases([newPurchase, ...purchases]);
    
    // Add to inventory
    addInventoryItem({
      id: Date.now().toString() + '-inv',
      lotNumber: newPurchase.lotNumber,
      quantity: newPurchase.quantity,
      location: newPurchase.location,
      dateAdded: newPurchase.date,
      netWeight: newPurchase.netWeight
    });
    
    // Update agent balance - consider this a debit to agent (negative amount)
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
    <div className="min-h-screen bg-ag-beige">
      <Navigation title="खरीदी (Purchase)" showBackButton />
      <div className="container mx-auto px-4 py-6">
        {!showForm ? (
          <>
            <div className="flex justify-end mb-6">
              <Button
                onClick={() => setShowForm(true)}
                className="action-button flex gap-2 items-center"
              >
                <PlusCircle size={24} />
                नई खरीदी (New Purchase)
              </Button>
            </div>

            {purchases.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-xl text-ag-brown">
                  कोई खरीदी नहीं मिली। नई खरीदी जोड़ने के लिए ऊपर वाले बटन पर क्लिक करें।
                </p>
                <p className="text-lg text-ag-brown-light mt-2">
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
                        <p className="font-semibold">मात्रा (Quantity):</p>
                        <p>{purchase.quantity} बैग</p>
                      </div>
                      <div>
                        <p className="font-semibold">एजेंट (Agent):</p>
                        <p>{purchase.agent}</p>
                      </div>
                      {purchase.party && (
                        <div>
                          <p className="font-semibold">पार्टी (Party):</p>
                          <p>{purchase.party}</p>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">स्थान (Location):</p>
                        <p>{purchase.location}</p>
                      </div>
                      <div>
                        <p className="font-semibold">शुद्ध वजन (Net Weight):</p>
                        <p>{purchase.netWeight} Kg</p>
                      </div>
                      <div>
                        <p className="font-semibold">दर (Rate):</p>
                        <p>₹{purchase.rate}/Kg</p>
                      </div>
                    </div>
                    <div className="mt-3 p-2 bg-ag-beige-light rounded-md">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="font-semibold">कुल राशि (Total):</p>
                          <p>{formatCurrency(purchase.totalAmount)}</p>
                        </div>
                        <div>
                          <p className="font-semibold">खर्चे (Expenses):</p>
                          <p>{formatCurrency(purchase.expenses)}</p>
                        </div>
                        <div>
                          <p className="font-semibold">खर्चों के बाद कुल (After Expenses):</p>
                          <p>{formatCurrency(purchase.totalAfterExpenses)}</p>
                        </div>
                        <div>
                          <p className="font-semibold">खर्चों के बाद प्रति किलो दर (Rate/Kg After):</p>
                          <p>₹{purchase.ratePerKgAfterExpenses.toFixed(2)}/Kg</p>
                        </div>
                      </div>
                    </div>
                    {purchase.notes && (
                      <p className="mt-2 text-ag-brown">
                        <span className="font-semibold">नोट्स:</span> {purchase.notes}
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
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowForm(false)}
                className="mr-2"
              >
                <ArrowLeft size={24} />
              </Button>
              <h2 className="form-title">नई खरीदी जोड़ें (Add New Purchase)</h2>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <Label htmlFor="date" className="form-label">दिनांक (Date)</Label>
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
                  <Label htmlFor="lotNumber" className="form-label">लॉट नंबर (Lot Number)</Label>
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
                  <Label htmlFor="agent" className="form-label">एजेंट (Agent)</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("agent", value)}
                    value={formData.agent}
                  >
                    <SelectTrigger className="text-lg p-6">
                      <SelectValue placeholder="एजेंट चुनें (Select Agent)" />
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
                  <Label htmlFor="party" className="form-label">पार्टी (Party/Supplier)</Label>
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
                  <Label htmlFor="quantity" className="form-label">मात्रा बैग (Quantity in Bags)</Label>
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
                  <Label htmlFor="netWeight" className="form-label">शुद्ध वजन Kg (Net Weight)</Label>
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
                  <Label htmlFor="rate" className="form-label">दर ₹/Kg (Rate)</Label>
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
                  <Label htmlFor="location" className="form-label">स्थान (Location)</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("location", value)}
                    value={formData.location}
                  >
                    <SelectTrigger className="text-lg p-6">
                      <SelectValue placeholder="स्थान चुनें (Select Location)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Chiplun">Chiplun</SelectItem>
                      <SelectItem value="Mumbai">Mumbai</SelectItem>
                      <SelectItem value="Sawantwadi">Sawantwadi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="form-group">
                  <Label htmlFor="transporter" className="form-label">ट्रांसपोर्टर (Transporter) - Optional</Label>
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
                  <Label htmlFor="totalAmount" className="form-label">कुल राशि (Total Amount)</Label>
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
                  <Label htmlFor="expenses" className="form-label">खर्चे (Expenses)</Label>
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
                  <Label htmlFor="totalAfterExpenses" className="form-label">खर्चों के बाद कुल (Total After Expenses)</Label>
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
                  <Label htmlFor="ratePerKgAfterExpenses" className="form-label">खर्चों के बाद प्रति किलो दर (Rate/Kg After)</Label>
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
                  <Label htmlFor="notes" className="form-label">नोट्स (Notes)</Label>
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
                <Button 
                  type="submit" 
                  className="action-button flex gap-2 items-center"
                >
                  <Save size={24} />
                  सहेजें (Save)
                </Button>
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
  );
};

export default Purchases;
