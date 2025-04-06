
import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Save, ArrowLeft, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Agent, getAgents, addAgent } from "@/services/storageService";

const Agents = () => {
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Omit<Agent, "id" | "balance">>({
    name: "",
    contactNumber: "",
    address: ""
  });

  // Load agents on component mount
  useEffect(() => {
    setAgents(getAgents());
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAgent: Agent = {
      id: Date.now().toString(),
      ...formData,
      balance: 0
    };
    
    // Add to storage
    addAgent(newAgent);
    
    // Update UI
    setAgents((prev) => [...prev, newAgent]);
    
    toast({
      title: "Agent Added",
      description: `Agent ${formData.name} added successfully.`
    });
    
    setFormData({
      name: "",
      contactNumber: "",
      address: ""
    });
    
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-ag-beige">
      <Navigation title="एजेंट्स (Agents)" showBackButton />
      <div className="container mx-auto px-4 py-6">
        {!showForm ? (
          <>
            <div className="flex justify-end mb-6">
              <Button
                onClick={() => setShowForm(true)}
                className="action-button flex gap-2 items-center"
              >
                <PlusCircle size={24} />
                नया एजेंट (New Agent)
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {agents.map((agent) => (
                <Card key={agent.id} className="p-4">
                  <div className="flex items-center border-b pb-3 mb-3">
                    <div className="bg-ag-green-light p-2 rounded-full mr-3">
                      <User size={32} className="text-ag-green" />
                    </div>
                    <h3 className="text-2xl font-bold">{agent.name}</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <p className="font-semibold">फोन नंबर (Phone):</p>
                      <p>{agent.contactNumber}</p>
                    </div>
                    <div>
                      <p className="font-semibold">पता (Address):</p>
                      <p>{agent.address}</p>
                    </div>
                    <div className={`mt-2 p-2 rounded-md ${
                      agent.balance > 0 
                        ? "bg-green-100" 
                        : agent.balance < 0 
                          ? "bg-red-100" 
                          : "bg-gray-100"
                    }`}>
                      <p className="font-semibold">बैलेंस (Balance):</p>
                      <p className={`text-xl font-bold ${
                        agent.balance > 0 
                          ? "text-green-600" 
                          : agent.balance < 0 
                            ? "text-red-600" 
                            : ""
                      }`}>
                        ₹ {agent.balance}
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
              <h2 className="form-title">नया एजेंट जोड़ें (Add New Agent)</h2>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <div className="form-group">
                  <Label htmlFor="name" className="form-label">नाम (Name)</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Agent name"
                    value={formData.name}
                    onChange={handleChange}
                    className="text-lg p-6"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <Label htmlFor="contactNumber" className="form-label">फोन नंबर (Contact Number)</Label>
                  <Input
                    id="contactNumber"
                    name="contactNumber"
                    placeholder="Phone number"
                    value={formData.contactNumber}
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

export default Agents;
