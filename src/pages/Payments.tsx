
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

interface PaymentEntry {
  id: string;
  date: string;
  agent: string;
  amount: number;
  paymentMethod: "cash" | "bank";
  bankDetails?: string;
  notes: string;
}

const Payments = () => {
  const { toast } = useToast();
  const [payments, setPayments] = useState<PaymentEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<PaymentEntry, "id">>({
    date: new Date().toISOString().split('T')[0],
    agent: "",
    amount: 0,
    paymentMethod: "cash",
    bankDetails: "",
    notes: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRadioChange = (value: "cash" | "bank") => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPayment: PaymentEntry = {
      id: Date.now().toString(),
      ...formData
    };
    
    setPayments((prev) => [newPayment, ...prev]);
    
    toast({
      title: "Payment Added",
      description: `Payment of ₹${formData.amount} to ${formData.agent} added successfully.`
    });
    
    setFormData({
      date: new Date().toISOString().split('T')[0],
      agent: "",
      amount: 0,
      paymentMethod: "cash",
      bankDetails: "",
      notes: ""
    });
    
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-ag-beige">
      <Navigation title="भुगतान (Payments)" showBackButton />
      <div className="container mx-auto px-4 py-6">
        {!showForm ? (
          <>
            <div className="flex justify-end mb-6">
              <Button
                onClick={() => setShowForm(true)}
                className="action-button flex gap-2 items-center"
              >
                <PlusCircle size={24} />
                नया भुगतान (New Payment)
              </Button>
            </div>

            {payments.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-xl text-ag-brown">
                  कोई भुगतान नहीं मिला। नया भुगतान जोड़ने के लिए ऊपर वाले बटन पर क्लिक करें।
                </p>
                <p className="text-lg text-ag-brown-light mt-2">
                  No payments found. Click the button above to add a new payment.
                </p>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {payments.map((payment) => (
                  <Card key={payment.id} className="p-4">
                    <div className="flex justify-between items-center border-b pb-2 mb-2">
                      <h3 className="text-xl font-bold">{payment.agent}</h3>
                      <p className="text-ag-brown">{new Date(payment.date).toLocaleDateString()}</p>
                    </div>
                    <div className="mt-2">
                      <p className="text-2xl font-bold text-ag-green">₹ {payment.amount}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-3 py-1 rounded-full ${
                          payment.paymentMethod === "cash" 
                            ? "bg-ag-orange text-white" 
                            : "bg-ag-green text-white"
                        }`}>
                          {payment.paymentMethod === "cash" ? "Cash" : "Bank"}
                        </span>
                        {payment.paymentMethod === "bank" && payment.bankDetails && (
                          <span className="text-ag-brown">{payment.bankDetails}</span>
                        )}
                      </div>
                    </div>
                    {payment.notes && (
                      <p className="mt-2 text-ag-brown">
                        <span className="font-semibold">नोट्स:</span> {payment.notes}
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
              <h2 className="form-title">नया भुगतान जोड़ें (Add New Payment)</h2>
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
                  <Label htmlFor="agent" className="form-label">एजेंट (Agent)</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("agent", value)}
                    value={formData.agent}
                  >
                    <SelectTrigger className="text-lg p-6">
                      <SelectValue placeholder="एजेंट चुनें (Select Agent)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Arvind">Arvind</SelectItem>
                      <SelectItem value="Ramesh">Ramesh</SelectItem>
                      <SelectItem value="Suresh">Suresh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="form-group">
                  <Label htmlFor="amount" className="form-label">राशि (Amount in ₹)</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    placeholder="10000"
                    value={formData.amount || ""}
                    onChange={handleChange}
                    className="text-lg p-6"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <Label className="form-label">भुगतान प्रकार (Payment Method)</Label>
                  <RadioGroup 
                    value={formData.paymentMethod} 
                    onValueChange={(value: "cash" | "bank") => handleRadioChange(value)}
                    className="flex space-x-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="text-lg">नकद (Cash)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bank" id="bank" />
                      <Label htmlFor="bank" className="text-lg">बैंक (Bank Transfer)</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {formData.paymentMethod === "bank" && (
                  <div className="form-group md:col-span-2">
                    <Label htmlFor="bankDetails" className="form-label">बैंक विवरण (Bank Details)</Label>
                    <Input
                      id="bankDetails"
                      name="bankDetails"
                      placeholder="Bank name / Transaction ID"
                      value={formData.bankDetails}
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

export default Payments;
