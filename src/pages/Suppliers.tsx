
import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Save, ArrowLeft, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getSuppliers, addSupplier } from "@/services/storageService";
import NewEntityForm from "@/components/NewEntityForm";

const Suppliers = () => {
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contactNumber: ""
  });

  // Load suppliers on component mount
  useEffect(() => {
    setSuppliers(getSuppliers());
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
    
    const newSupplier = {
      id: Date.now().toString(),
      ...formData,
      balance: 0
    };
    
    // Add to storage
    addSupplier(newSupplier);
    
    // Update UI
    setSuppliers((prev) => [...prev, newSupplier]);
    
    toast({
      title: "Supplier Added",
      description: `Supplier ${formData.name} added successfully.`
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
      <Navigation title="सप्लायर्स (Suppliers)" showBackButton />
      <div className="container mx-auto px-4 py-6">
        {!showForm ? (
          <>
            <div className="flex justify-end mb-6">
              <Button
                onClick={() => setShowForm(true)}
                className="action-button flex gap-2 items-center"
              >
                <PlusCircle size={24} />
                नया सप्लायर (New Supplier)
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {suppliers.map((supplier) => (
                <Card key={supplier.id} className="p-4">
                  <div className="flex items-center border-b pb-3 mb-3">
                    <div className="bg-ag-orange-light p-2 rounded-full mr-3">
                      <Truck size={32} className="text-ag-orange" />
                    </div>
                    <h3 className="text-2xl font-bold">{supplier.name}</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <p className="font-semibold">पता (Address):</p>
                      <p>{supplier.address}</p>
                    </div>
                    {supplier.contactNumber && (
                      <div>
                        <p className="font-semibold">फोन (Contact):</p>
                        <p>{supplier.contactNumber}</p>
                      </div>
                    )}
                    <div className={`mt-2 p-2 rounded-md ${
                      supplier.balance > 0 
                        ? "bg-green-100" 
                        : supplier.balance < 0 
                          ? "bg-red-100" 
                          : "bg-gray-100"
                    }`}>
                      <p className="font-semibold">बैलेंस (Balance):</p>
                      <p className={`text-xl font-bold ${
                        supplier.balance > 0 
                          ? "text-green-600" 
                          : supplier.balance < 0 
                            ? "text-red-600" 
                            : ""
                      }`}>
                        ₹ {supplier.balance}
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
              <h2 className="form-title">नया सप्लायर जोड़ें (Add New Supplier)</h2>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <div className="form-group">
                  <Label htmlFor="name" className="form-label">नाम (Name)</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Supplier name"
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

export default Suppliers;
