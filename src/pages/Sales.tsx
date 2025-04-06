
import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PlusCircle, Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SaleEntry {
  id: string;
  date: string;
  lotNumber: string;
  quantity: number;
  customer: string;
  broker: string;
  amount: number;
  paymentType: "full" | "partial" | "cash";
  paymentReceived: number;
  notes: string;
}

const Sales = () => {
  const { toast } = useToast();
  const [sales, setSales] = useState<SaleEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<SaleEntry, "id">>({
    date: new Date().toISOString().split('T')[0],
    lotNumber: "",
    quantity: 0,
    customer: "",
    broker: "",
    amount: 0,
    paymentType: "full",
    paymentReceived: 0,
    notes: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numFields = ["quantity", "amount", "paymentReceived"];
    setFormData((prev) => ({
      ...prev,
      [name]: numFields.includes(name) ? Number(value) : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRadioChange = (value: "full" | "partial" | "cash") => {
    setFormData((prev) => {
      const newState = { ...prev, paymentType: value };
      if (value === "full") {
        newState.paymentReceived = newState.amount;
      } else if (value === "cash") {
        newState.paymentReceived = newState.amount;
      }
      return newState;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSale: SaleEntry = {
      id: Date.now().toString(),
      ...formData
    };
    
    setSales((prev) => [newSale, ...prev]);
    
    toast({
      title: "Sale Added",
      description: `Sale of ${formData.quantity} bags from lot ${formData.lotNumber} added successfully.`
    });
    
    setFormData({
      date: new Date().toISOString().split('T')[0],
      lotNumber: "",
      quantity: 0,
      customer: "",
      broker: "",
      amount: 0,
      paymentType: "full",
      paymentReceived: 0,
      notes: ""
    });
    
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-ag-beige">
      <Navigation title="बिक्री (Sales)" showBackButton />
      <div className="container mx-auto px-4 py-6">
        {!showForm ? (
          <>
            <div className="flex justify-end mb-6">
              <Button
                onClick={() => setShowForm(true)}
                className="action-button flex gap-2 items-center"
              >
                <PlusCircle size={24} />
                नई बिक्री (New Sale)
              </Button>
            </div>

            {sales.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-xl text-ag-brown">
                  कोई बिक्री नहीं मिली। नई बिक्री जोड़ने के लिए ऊपर वाले बटन पर क्लिक करें।
                </p>
                <p className="text-lg text-ag-brown-light mt-2">
                  No sales found. Click the button above to add a new sale.
                </p>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {sales.map((sale) => (
                  <Card key={sale.id} className="p-4">
                    <div className="flex justify-between items-center border-b pb-2 mb-2">
                      <h3 className="text-xl font-bold">{sale.lotNumber}</h3>
                      <p className="text-ag-brown">{new Date(sale.date).toLocaleDateString()}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="font-semibold">मात्रा (Quantity):</p>
                        <p>{sale.quantity} बैग</p>
                      </div>
                      <div>
                        <p className="font-semibold">ग्राहक (Customer):</p>
                        <p>{sale.customer}</p>
                      </div>
                      {sale.broker && (
                        <div>
                          <p className="font-semibold">ब्रोकर (Broker):</p>
                          <p>{sale.broker}</p>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 p-2 bg-ag-beige-light rounded-md">
                      <div className="flex justify-between">
                        <p className="font-semibold">कुल राशि (Total):</p>
                        <p className="font-bold">₹{sale.amount}</p>
                      </div>
                      <div className="flex justify-between mt-1">
                        <p className="font-semibold">प्राप्त राशि (Received):</p>
                        <p className="font-bold">₹{sale.paymentReceived}</p>
                      </div>
                      <div className="flex justify-between mt-1">
                        <p className="font-semibold">बकाया राशि (Balance):</p>
                        <p className={`font-bold ${sale.amount - sale.paymentReceived > 0 ? "text-red-500" : ""}`}>
                          ₹{sale.amount - sale.paymentReceived}
                        </p>
                      </div>
                    </div>
                    {sale.notes && (
                      <p className="mt-2 text-ag-brown text-sm">
                        <span className="font-semibold">नोट्स:</span> {sale.notes}
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
              <h2 className="form-title">नई बिक्री जोड़ें (Add New Sale)</h2>
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
                    className="text-lg p-6"
                    required
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
                  <Label htmlFor="customer" className="form-label">ग्राहक (Customer)</Label>
                  <Input
                    id="customer"
                    name="customer"
                    placeholder="Customer name"
                    value={formData.customer}
                    onChange={handleChange}
                    className="text-lg p-6"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <Label htmlFor="broker" className="form-label">ब्रोकर (Broker) - Optional</Label>
                  <Input
                    id="broker"
                    name="broker"
                    placeholder="Broker name (if applicable)"
                    value={formData.broker}
                    onChange={handleChange}
                    className="text-lg p-6"
                  />
                </div>
                
                <div className="form-group">
                  <Label htmlFor="amount" className="form-label">कुल राशि (Total Amount)</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    placeholder="50000"
                    value={formData.amount || ""}
                    onChange={handleChange}
                    className="text-lg p-6"
                    required
                  />
                </div>
                
                <div className="form-group md:col-span-2">
                  <Label className="form-label">भुगतान प्रकार (Payment Type)</Label>
                  <RadioGroup 
                    value={formData.paymentType} 
                    onValueChange={(value: "full" | "partial" | "cash") => handleRadioChange(value)}
                    className="flex flex-col space-y-2 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="full" id="full" />
                      <Label htmlFor="full" className="text-lg">पूरा भुगतान (Full Invoice)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="partial" id="partial" />
                      <Label htmlFor="partial" className="text-lg">आंशिक भुगतान (Partial Payment)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="text-lg">नकद (Cash Balance)</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {formData.paymentType === "partial" && (
                  <div className="form-group md:col-span-2">
                    <Label htmlFor="paymentReceived" className="form-label">प्राप्त राशि (Amount Received)</Label>
                    <Input
                      id="paymentReceived"
                      name="paymentReceived"
                      type="number"
                      placeholder="25000"
                      value={formData.paymentReceived || ""}
                      onChange={handleChange}
                      className="text-lg p-6"
                      required
                    />
                  </div>
                )}
                
                <div className="form-group md:col-span-2">
                  <Label htmlFor="notes" className="form-label">नोट्स (Notes)</Label>
                  <Input
                    id="notes"
                    name="notes"
                    placeholder="Additional notes..."
                    value={formData.notes}
                    onChange={handleChange}
                    className="text-lg p-6"
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
    </div>
  );
};

export default Sales;
