
import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Save, ArrowLeft, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TransportEntry {
  id: string;
  date: string;
  lotNumber: string;
  quantity: number;
  fromLocation: string;
  toLocation: string;
  transporter: string;
  cost: number;
}

const Transport = () => {
  const { toast } = useToast();
  const [transports, setTransports] = useState<TransportEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<TransportEntry, "id">>({
    date: new Date().toISOString().split('T')[0],
    lotNumber: "",
    quantity: 0,
    fromLocation: "",
    toLocation: "",
    transporter: "",
    cost: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "cost" ? Number(value) : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTransport: TransportEntry = {
      id: Date.now().toString(),
      ...formData
    };
    
    setTransports((prev) => [newTransport, ...prev]);
    
    toast({
      title: "Transport Added",
      description: `Transport of ${formData.quantity} bags from ${formData.fromLocation} to ${formData.toLocation} added successfully.`
    });
    
    setFormData({
      date: new Date().toISOString().split('T')[0],
      lotNumber: "",
      quantity: 0,
      fromLocation: "",
      toLocation: "",
      transporter: "",
      cost: 0
    });
    
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-ag-beige">
      <Navigation title="ट्रांसपोर्ट (Transport)" showBackButton />
      <div className="container mx-auto px-4 py-6">
        {!showForm ? (
          <>
            <div className="flex justify-end mb-6">
              <Button
                onClick={() => setShowForm(true)}
                className="action-button flex gap-2 items-center"
              >
                <PlusCircle size={24} />
                नया ट्रांसपोर्ट (New Transport)
              </Button>
            </div>

            {transports.length === 0 ? (
              <Card className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <Truck size={64} className="text-ag-brown opacity-50" />
                </div>
                <p className="text-xl text-ag-brown">
                  कोई ट्रांसपोर्ट नहीं मिला। नया ट्रांसपोर्ट जोड़ने के लिए ऊपर वाले बटन पर क्लिक करें।
                </p>
                <p className="text-lg text-ag-brown-light mt-2">
                  No transports found. Click the button above to add a new transport.
                </p>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {transports.map((transport) => (
                  <Card key={transport.id} className="p-4">
                    <div className="flex justify-between items-center border-b pb-2 mb-2">
                      <h3 className="text-xl font-bold">{transport.lotNumber}</h3>
                      <p className="text-ag-brown">{new Date(transport.date).toLocaleDateString()}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="font-semibold">From:</p>
                        <p>{transport.fromLocation}</p>
                      </div>
                      <div>
                        <p className="font-semibold">To:</p>
                        <p>{transport.toLocation}</p>
                      </div>
                      <div>
                        <p className="font-semibold">मात्रा (Quantity):</p>
                        <p>{transport.quantity} बैग</p>
                      </div>
                      <div>
                        <p className="font-semibold">ट्रांसपोर्टर:</p>
                        <p>{transport.transporter}</p>
                      </div>
                    </div>
                    <div className="mt-2 bg-ag-beige-light p-2 rounded-md">
                      <p className="font-semibold">लागत (Cost):</p>
                      <p className="text-lg">₹ {transport.cost}</p>
                    </div>
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
              <h2 className="form-title">नया ट्रांसपोर्ट जोड़ें (Add New Transport)</h2>
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
                  <Label htmlFor="transporter" className="form-label">ट्रांसपोर्टर (Transporter)</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("transporter", value)}
                    value={formData.transporter}
                  >
                    <SelectTrigger className="text-lg p-6">
                      <SelectValue placeholder="ट्रांसपोर्टर चुनें (Select Transporter)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sudha">Sudha</SelectItem>
                      <SelectItem value="Express Cargo">Express Cargo</SelectItem>
                      <SelectItem value="Raja Transport">Raja Transport</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="form-group">
                  <Label htmlFor="fromLocation" className="form-label">कहां से (From Location)</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("fromLocation", value)}
                    value={formData.fromLocation}
                  >
                    <SelectTrigger className="text-lg p-6">
                      <SelectValue placeholder="स्थान चुनें (Select Location)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Chiplun">Chiplun</SelectItem>
                      <SelectItem value="Mumbai">Mumbai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="form-group">
                  <Label htmlFor="toLocation" className="form-label">कहां तक (To Location)</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("toLocation", value)}
                    value={formData.toLocation}
                  >
                    <SelectTrigger className="text-lg p-6">
                      <SelectValue placeholder="स्थान चुनें (Select Location)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Chiplun">Chiplun</SelectItem>
                      <SelectItem value="Mumbai">Mumbai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="form-group">
                  <Label htmlFor="cost" className="form-label">लागत (Cost in ₹)</Label>
                  <Input
                    id="cost"
                    name="cost"
                    type="number"
                    placeholder="1000"
                    value={formData.cost || ""}
                    onChange={handleChange}
                    className="text-lg p-6"
                    required
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

export default Transport;
