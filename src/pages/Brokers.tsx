import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Save, ArrowLeft, HandCoins } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getBrokers, addBroker } from "@/services/storageService";

const Brokers = () => {
  const { toast } = useToast();
  const [brokers, setBrokers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contactNumber: "",
    commissionRate: 1
  });

  useEffect(() => {
    setBrokers(getBrokers());
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'commissionRate' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newBroker = {
      id: Date.now().toString(),
      ...formData,
      balance: 0
    };
    
    addBroker(newBroker);
    
    setBrokers((prev) => [...prev, newBroker]);
    
    toast({
      title: "Broker Added",
      description: `Broker ${formData.name} added successfully.`
    });
    
    setFormData({
      name: "",
      address: "",
      contactNumber: "",
      commissionRate: 1
    });
    
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-ag-beige">
      <Navigation title="दलाल (Brokers)" showBackButton />
      <div className="container mx-auto px-4 py-6">
        {!showForm ? (
          <>
            <div className="flex justify-end mb-6">
              <Button
                onClick={() => setShowForm(true)}
                className="action-button flex gap-2 items-center"
              >
                <PlusCircle size={24} />
                नया दलाल (New Broker)
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {brokers.map((broker) => (
                <Card key={broker.id} className="p-4">
                  <div className="flex items-center border-b pb-3 mb-3">
                    <div className="bg-ag-purple-light p-2 rounded-full mr-3">
                      <HandCoins size={32} className="text-ag-purple" />
                    </div>
                    <h3 className="text-2xl font-bold">{broker.name}</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <p className="font-semibold">पता (Address):</p>
                      <p>{broker.address}</p>
                    </div>
                    {broker.contactNumber && (
                      <div>
                        <p className="font-semibold">फोन (Contact):</p>
                        <p>{broker.contactNumber}</p>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">कमीशन दर (Commission Rate):</p>
                      <p>{broker.commissionRate || 1}%</p>
                    </div>
                    <div className={`mt-2 p-2 rounded-md ${
                      broker.balance > 0 
                        ? "bg-green-100" 
                        : broker.balance < 0 
                          ? "bg-red-100" 
                          : "bg-gray-100"
                    }`}>
                      <p className="font-semibold">बैलेंस (Balance):</p>
                      <p className={`text-xl font-bold ${
                        broker.balance > 0 
                          ? "text-green-600" 
                          : broker.balance < 0 
                            ? "text-red-600" 
                            : ""
                      }`}>
                        ₹ {broker.balance}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
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
              <h2 className="form-title">नया दलाल जोड़ें (Add New Broker)</h2>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <div className="form-group">
                  <Label htmlFor="name" className="form-label">नाम (Name)</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Broker name"
                    value={formData.name}
                    onChange={handleChange}
                    className="text-lg p-6"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <Label htmlFor="address" className="form-label">पता (Address)</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    className="text-lg p-6"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <Label htmlFor="contactNumber" className="form-label">फोन (Contact Number)</Label>
                  <Input
                    id="contactNumber"
                    name="contactNumber"
                    placeholder="Contact number"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="text-lg p-6"
                  />
                </div>
                
                <div className="form-group">
                  <Label htmlFor="commissionRate" className="form-label">कमीशन दर % (Commission Rate %)</Label>
                  <Input
                    id="commissionRate"
                    name="commissionRate"
                    placeholder="Commission rate (%)"
                    value={formData.commissionRate}
                    onChange={handleChange}
                    type="number"
                    min="0"
                    step="0.1"
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

export default Brokers;
