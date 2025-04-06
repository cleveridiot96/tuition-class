
import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Save, Edit, Trash, Phone, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  getAgents, 
  addAgent, 
  updateAgent, 
  deleteAgent,
  getSuppliers,
  addSupplier,
  updateSupplier,
  deleteSupplier,
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  getBrokers,
  addBroker,
  updateBroker,
  deleteBroker,
  getTransporters,
  addTransporter,
  updateTransporter,
  deleteTransporter
} from "@/services/storageService";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Party {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  [key: string]: any;
}

const Master = () => {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState("agents");
  const [parties, setParties] = useState<Party[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Party>({
    id: "",
    name: "",
    phone: "",
    address: ""
  });
  
  useEffect(() => {
    loadParties(currentTab);
  }, [currentTab]);
  
  const loadParties = (type: string) => {
    let partyList: Party[] = [];
    
    switch (type) {
      case "agents":
        partyList = getAgents();
        break;
      case "suppliers":
        partyList = getSuppliers();
        break;
      case "customers":
        partyList = getCustomers();
        break;
      case "brokers":
        partyList = getBrokers();
        break;
      case "transporters":
        partyList = getTransporters();
        break;
      default:
        partyList = [];
    }
    
    setParties(partyList);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddEdit = () => {
    setIsEditing(false);
    setFormData({
      id: "",
      name: "",
      phone: "",
      address: ""
    });
    setShowForm(true);
  };
  
  const handleEditClick = (party: Party) => {
    setIsEditing(true);
    setFormData(party);
    setShowForm(true);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        // Update existing party
        switch (currentTab) {
          case "agents":
            updateAgent(formData.id, formData);
            break;
          case "suppliers":
            updateSupplier(formData.id, formData);
            break;
          case "customers":
            updateCustomer(formData.id, formData);
            break;
          case "brokers":
            updateBroker(formData.id, formData);
            break;
          case "transporters":
            updateTransporter(formData.id, formData);
            break;
        }
        
        toast({
          title: "अपडेट सफल",
          description: `${formData.name} successfully updated.`,
        });
      } else {
        // Add new party
        const newId = Date.now().toString();
        const newParty = { ...formData, id: newId };
        
        switch (currentTab) {
          case "agents":
            addAgent(newParty);
            break;
          case "suppliers":
            addSupplier(newParty);
            break;
          case "customers":
            addCustomer(newParty);
            break;
          case "brokers":
            addBroker(newParty);
            break;
          case "transporters":
            addTransporter(newParty);
            break;
        }
        
        toast({
          title: "जोड़ दिया गया",
          description: `${formData.name} successfully added.`,
        });
      }
      
      // Reload parties and reset form
      loadParties(currentTab);
      setShowForm(false);
      setFormData({
        id: "",
        name: "",
        phone: "",
        address: ""
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleDelete = (id: string, name: string) => {
    try {
      switch (currentTab) {
        case "agents":
          deleteAgent(id);
          break;
        case "suppliers":
          deleteSupplier(id);
          break;
        case "customers":
          deleteCustomer(id);
          break;
        case "brokers":
          deleteBroker(id);
          break;
        case "transporters":
          deleteTransporter(id);
          break;
      }
      
      toast({
        title: "हटा दिया गया",
        description: `${name} successfully deleted.`,
      });
      
      loadParties(currentTab);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not delete. This party might be referenced in transactions.",
        variant: "destructive"
      });
    }
  };
  
  const getTabTitle = () => {
    switch (currentTab) {
      case "agents": return "एजेंट्स (Agents)";
      case "suppliers": return "सप्लायर्स (Suppliers)";
      case "customers": return "ग्राहक (Customers)";
      case "brokers": return "ब्रोकर (Brokers)";
      case "transporters": return "ट्रांसपोर्टर (Transporters)";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-ag-beige">
      <Navigation title="मास्टर (Master)" showBackButton showHomeButton />
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="agents" className="w-full" onValueChange={setCurrentTab}>
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="agents">एजेंट्स</TabsTrigger>
            <TabsTrigger value="suppliers">सप्लायर्स</TabsTrigger>
            <TabsTrigger value="customers">ग्राहक</TabsTrigger>
            <TabsTrigger value="brokers">ब्रोकर</TabsTrigger>
            <TabsTrigger value="transporters">ट्रांसपोर्टर</TabsTrigger>
          </TabsList>
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{getTabTitle()}</h2>
            <Button 
              onClick={handleAddEdit}
              className="action-button flex items-center gap-2"
            >
              <PlusCircle size={24} />
              नया जोड़ें (Add New)
            </Button>
          </div>
          
          {showForm ? (
            <Card className="p-6 mb-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <Label htmlFor="name" className="form-label">नाम (Name)</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter name"
                      value={formData.name}
                      onChange={handleChange}
                      className="text-lg p-6"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <Label htmlFor="phone" className="form-label">फोन (Phone)</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="text-lg p-6"
                    />
                  </div>
                  
                  <div className="form-group md:col-span-2">
                    <Label htmlFor="address" className="form-label">पता (Address)</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="Enter address"
                      value={formData.address}
                      onChange={handleChange}
                      className="text-lg p-6"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    रद्द करें (Cancel)
                  </Button>
                  <Button 
                    type="submit" 
                    className="action-button flex gap-2 items-center"
                  >
                    <Save size={24} />
                    {isEditing ? 'अपडेट करें (Update)' : 'सहेजें (Save)'}
                  </Button>
                </div>
              </form>
            </Card>
          ) : null}
          
          {parties.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-xl text-ag-brown">
                कोई डेटा नहीं मिला। नया जोड़ने के लिए ऊपर वाले बटन पर क्लिक करें।
              </p>
              <p className="text-lg text-ag-brown-light mt-2">
                No data found. Click the button above to add new.
              </p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {parties.map((party) => (
                <Card key={party.id} className="p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">{party.name}</h3>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEditClick(party)}
                      >
                        <Edit size={18} />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash size={18} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>क्या आप निश्चित हैं?</DialogTitle>
                            <DialogDescription>
                              {`${party.name} को हटाने की पुष्टि करें। यह क्रिया अपरिवर्तनीय है।`}
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline">रद्द करें (Cancel)</Button>
                            <Button 
                              variant="destructive"
                              onClick={() => handleDelete(party.id, party.name)}
                            >
                              हटाएं (Delete)
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  {party.phone && (
                    <div className="flex items-center gap-2 mt-2">
                      <Phone size={16} className="text-gray-500" />
                      <span>{party.phone}</span>
                    </div>
                  )}
                  {party.address && (
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin size={16} className="text-gray-500" />
                      <span className="text-gray-600">{party.address}</span>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Master;
