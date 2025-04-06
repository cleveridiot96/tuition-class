
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
import { PlusCircle, Save, Edit, Trash, MapPin } from "lucide-react";
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
  deleteTransporter,
  Agent,
  Supplier,
  Customer,
  Broker,
  Transporter
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PartyFormData {
  id: string;
  name: string;
  address: string;
}

const Master = () => {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState("agents");
  const [parties, setParties] = useState<(Agent | Supplier | Customer | Broker | Transporter)[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<PartyFormData>({
    id: "",
    name: "",
    address: ""
  });
  const [deletedParties, setDeletedParties] = useState<(Agent | Supplier | Customer | Broker | Transporter)[]>([]);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  
  useEffect(() => {
    loadParties(currentTab);
  }, [currentTab]);
  
  const loadParties = (type: string) => {
    let partyList: (Agent | Supplier | Customer | Broker | Transporter)[] = [];
    
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
      address: ""
    });
    setShowForm(true);
  };
  
  const handleEditClick = (party: Agent | Supplier | Customer | Broker | Transporter) => {
    setIsEditing(true);
    setFormData({
      id: party.id,
      name: party.name,
      address: party.address
    });
    setShowForm(true);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        // Update existing party
        switch (currentTab) {
          case "agents":
            updateAgent({
              ...formData,
              id: formData.id,
              contactNumber: "", // Keeping empty string for compatibility
              balance: (parties.find(p => p.id === formData.id) as Agent)?.balance || 0
            } as Agent);
            break;
          case "suppliers":
            updateSupplier({
              ...formData,
              id: formData.id,
              contactNumber: "", // Keeping empty string for compatibility
              balance: (parties.find(p => p.id === formData.id) as Supplier)?.balance || 0
            } as Supplier);
            break;
          case "customers":
            updateCustomer({
              ...formData,
              id: formData.id,
              contactNumber: "", // Keeping empty string for compatibility
              balance: (parties.find(p => p.id === formData.id) as Customer)?.balance || 0
            } as Customer);
            break;
          case "brokers":
            updateBroker({
              ...formData,
              id: formData.id,
              contactNumber: "", // Keeping empty string for compatibility
              balance: (parties.find(p => p.id === formData.id) as Broker)?.balance || 0
            } as Broker);
            break;
          case "transporters":
            updateTransporter({
              ...formData,
              id: formData.id,
              contactNumber: "", // Keeping empty string for compatibility
              balance: (parties.find(p => p.id === formData.id) as Transporter)?.balance || 0
            } as Transporter);
            break;
        }
        
        toast({
          title: "Updated",
          description: `${formData.name} successfully updated.`,
        });
      } else {
        // Add new party
        const newId = Date.now().toString();
        
        switch (currentTab) {
          case "agents":
            addAgent({
              ...formData,
              id: newId,
              contactNumber: "", // Keeping empty string for compatibility
              balance: 0
            } as Agent);
            break;
          case "suppliers":
            addSupplier({
              ...formData,
              id: newId,
              contactNumber: "", // Keeping empty string for compatibility
              balance: 0
            } as Supplier);
            break;
          case "customers":
            addCustomer({
              ...formData,
              id: newId,
              contactNumber: "", // Keeping empty string for compatibility
              balance: 0
            } as Customer);
            break;
          case "brokers":
            addBroker({
              ...formData,
              id: newId,
              contactNumber: "", // Keeping empty string for compatibility
              balance: 0
            } as Broker);
            break;
          case "transporters":
            addTransporter({
              ...formData,
              id: newId,
              contactNumber: "", // Keeping empty string for compatibility
              balance: 0
            } as Transporter);
            break;
        }
        
        toast({
          title: "Added",
          description: `${formData.name} successfully added.`,
        });
      }
      
      // Reload parties and reset form
      loadParties(currentTab);
      setShowForm(false);
      setFormData({
        id: "",
        name: "",
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
      const partyToDelete = parties.find(p => p.id === id);
      if (partyToDelete) {
        setDeletedParties(prev => [...prev, partyToDelete]);
      }
      
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
        title: "Deleted",
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
  
  const handleRestore = (party: Agent | Supplier | Customer | Broker | Transporter) => {
    try {
      switch (currentTab) {
        case "agents":
          addAgent(party as Agent);
          break;
        case "suppliers":
          addSupplier(party as Supplier);
          break;
        case "customers":
          addCustomer(party as Customer);
          break;
        case "brokers":
          addBroker(party as Broker);
          break;
        case "transporters":
          addTransporter(party as Transporter);
          break;
      }
      
      setDeletedParties(prev => prev.filter(p => p.id !== party.id));
      loadParties(currentTab);
      
      toast({
        title: "Restored",
        description: `${party.name} successfully restored.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not restore. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const getTabTitle = () => {
    switch (currentTab) {
      case "agents": return "Agents";
      case "suppliers": return "Suppliers";
      case "customers": return "Customers";
      case "brokers": return "Brokers";
      case "transporters": return "Transporters";
      default: return "";
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-ag-beige">
        <Navigation title="Master" showBackButton showHomeButton />
        <div className="container mx-auto px-4 py-6">
          <Tabs defaultValue="agents" className="w-full" onValueChange={setCurrentTab}>
            <TabsList className="grid grid-cols-5 mb-6">
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="agents">Agents</TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Manage your business agents</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Manage your suppliers</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="customers">Customers</TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Manage your customers</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="brokers">Brokers</TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Manage your brokers</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="transporters">Transporters</TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Manage your transporters</p>
                </TooltipContent>
              </Tooltip>
            </TabsList>
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{getTabTitle()}</h2>
              <div className="flex gap-2">
                <Button 
                  onClick={handleAddEdit}
                  className="action-button flex items-center gap-2"
                >
                  <PlusCircle size={24} />
                  Add New
                </Button>
                <Button 
                  onClick={() => setShowRestoreDialog(true)}
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled={deletedParties.length === 0}
                >
                  Restore Deleted
                </Button>
              </div>
            </div>
            
            {showForm ? (
              <Card className="p-6 mb-6">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <div className="form-group">
                      <Label htmlFor="name" className="form-label">Name</Label>
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
                      <Label htmlFor="address" className="form-label">Address</Label>
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
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="action-button flex gap-2 items-center"
                    >
                      <Save size={24} />
                      {isEditing ? 'Update' : 'Save'}
                    </Button>
                  </div>
                </form>
              </Card>
            ) : null}
            
            {parties.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-xl text-ag-brown">
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
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEditClick(party)}
                            >
                              <Edit size={18} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit this entry</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Dialog>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash size={18} />
                                </Button>
                              </DialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete this entry</p>
                            </TooltipContent>
                          </Tooltip>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Are you sure?</DialogTitle>
                              <DialogDescription>
                                Confirm deletion of {party.name}. This action is irreversible.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline">Cancel</Button>
                              <Button 
                                variant="destructive"
                                onClick={() => handleDelete(party.id, party.name)}
                              >
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
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
        
        {/* Restore Dialog */}
        <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Restore Deleted Items</DialogTitle>
            </DialogHeader>
            <div className="max-h-[300px] overflow-y-auto">
              {deletedParties.length > 0 ? (
                deletedParties.map(party => (
                  <div key={party.id} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium">{party.name}</p>
                      {party.address && <p className="text-sm text-gray-500">{party.address}</p>}
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleRestore(party)}
                    >
                      Restore
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-center py-4">No deleted items to restore</p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRestoreDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default Master;
