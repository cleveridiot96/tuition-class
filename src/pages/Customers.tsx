
import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Save, ArrowLeft, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCustomers, addCustomer } from "@/services/storageService";
import NewEntityForm from "@/components/NewEntityForm";

const Customers = () => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contactNumber: ""
  });

  // Load customers on component mount
  useEffect(() => {
    setCustomers(getCustomers());
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newCustomer = {
      id: Date.now().toString(),
      ...formData,
      balance: 0
    };
    
    // Add to storage
    addCustomer(newCustomer);
    
    // Update UI
    setCustomers((prev) => [...prev, newCustomer]);
    
    toast({
      title: "Customer Added",
      description: `Customer ${formData.name} added successfully.`
    });
    
    setFormData({
      name: "",
      address: "",
      contactNumber: ""
    });
    
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-ag-beige">
      <Navigation title="ग्राहक (Customers)" showBackButton />
      <div className="container mx-auto px-4 py-6">
        {!showForm ? (
          <>
            <div className="flex justify-end mb-6">
              <Button
                onClick={() => setShowForm(true)}
                className="action-button flex gap-2 items-center"
              >
                <PlusCircle size={24} />
                नया ग्राहक (New Customer)
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {customers.map((customer) => (
                <Card key={customer.id} className="p-4">
                  <div className="flex items-center border-b pb-3 mb-3">
                    <div className="bg-ag-green-light p-2 rounded-full mr-3">
                      <User size={32} className="text-ag-green" />
                    </div>
                    <h3 className="text-2xl font-bold">{customer.name}</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <p className="font-semibold">पता (Address):</p>
                      <p>{customer.address}</p>
                    </div>
                    {customer.contactNumber && (
                      <div>
                        <p className="font-semibold">फोन (Contact):</p>
                        <p>{customer.contactNumber}</p>
                      </div>
                    )}
                    <div className={`mt-2 p-2 rounded-md ${
                      customer.balance > 0 
                        ? "bg-green-100" 
                        : customer.balance < 0 
                          ? "bg-red-100" 
                          : "bg-gray-100"
                    }`}>
                      <p className="font-semibold">बैलेंस (Balance):</p>
                      <p className={`text-xl font-bold ${
                        customer.balance > 0 
                          ? "text-green-600" 
                          : customer.balance < 0 
                            ? "text-red-600" 
                            : ""
                      }`}>
                        ₹ {customer.balance}
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
              <h2 className="form-title">नया ग्राहक जोड़ें (Add New Customer)</h2>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <div className="form-group">
                  <Label htmlFor="name" className="form-label">नाम (Name)</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Customer name"
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

export default Customers;
