
import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

import {
  getAgents,
  getBrokers,
  getCustomers,
  getTransporters,
  addAgent,
  addBroker,
  addCustomer,
  addTransporter
} from "@/services/storageService";

const Master = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("agents");
  
  // Form states
  const [agentForm, setAgentForm] = useState({
    name: "",
    contactNumber: "",
    address: "",
  });
  
  const [brokerForm, setBrokerForm] = useState({
    name: "",
    contactNumber: "",
    address: "",
    commissionRate: 1,
  });
  
  const [customerForm, setCustomerForm] = useState({
    name: "",
    contactNumber: "",
    address: "",
  });
  
  const [transporterForm, setTransporterForm] = useState({
    name: "",
    contactNumber: "",
    address: "",
  });
  
  // Data states
  const [agents, setAgents] = useState(getAgents());
  const [brokers, setBrokers] = useState(getBrokers());
  const [customers, setCustomers] = useState(getCustomers());
  const [transporters, setTransporters] = useState(getTransporters());
  
  // Form handlers
  const handleAgentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAgentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleBrokerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBrokerForm(prev => ({
      ...prev,
      [name]: name === 'commissionRate' ? parseFloat(value) : value
    }));
  };
  
  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleTransporterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTransporterForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Form submissions
  const handleAgentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agentForm.name || !agentForm.contactNumber) {
      toast({
        title: "Validation Error",
        description: "Name and contact number are required",
        variant: "destructive"
      });
      return;
    }
    
    const newAgent = {
      id: `agent-${Date.now()}`,
      ...agentForm,
      balance: 0
    };
    
    addAgent(newAgent);
    
    toast({
      title: "Agent Added",
      description: `${newAgent.name} has been added successfully`
    });
    
    // Reset form and refresh data
    setAgentForm({
      name: "",
      contactNumber: "",
      address: "",
    });
    
    setAgents(getAgents());
  };
  
  const handleBrokerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!brokerForm.name || !brokerForm.contactNumber) {
      toast({
        title: "Validation Error",
        description: "Name and contact number are required",
        variant: "destructive"
      });
      return;
    }
    
    const newBroker = {
      id: `broker-${Date.now()}`,
      ...brokerForm,
      balance: 0
    };
    
    addBroker(newBroker);
    
    toast({
      title: "Broker Added",
      description: `${newBroker.name} has been added successfully`
    });
    
    // Reset form and refresh data
    setBrokerForm({
      name: "",
      contactNumber: "",
      address: "",
      commissionRate: 1,
    });
    
    setBrokers(getBrokers());
  };
  
  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerForm.name || !customerForm.contactNumber) {
      toast({
        title: "Validation Error",
        description: "Name and contact number are required",
        variant: "destructive"
      });
      return;
    }
    
    const newCustomer = {
      id: `customer-${Date.now()}`,
      ...customerForm,
      balance: 0
    };
    
    addCustomer(newCustomer);
    
    toast({
      title: "Customer Added",
      description: `${newCustomer.name} has been added successfully`
    });
    
    // Reset form and refresh data
    setCustomerForm({
      name: "",
      contactNumber: "",
      address: "",
    });
    
    setCustomers(getCustomers());
  };
  
  const handleTransporterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transporterForm.name || !transporterForm.contactNumber) {
      toast({
        title: "Validation Error",
        description: "Name and contact number are required",
        variant: "destructive"
      });
      return;
    }
    
    const newTransporter = {
      id: `transporter-${Date.now()}`,
      ...transporterForm,
      balance: 0
    };
    
    addTransporter(newTransporter);
    
    toast({
      title: "Transporter Added",
      description: `${newTransporter.name} has been added successfully`
    });
    
    // Reset form and refresh data
    setTransporterForm({
      name: "",
      contactNumber: "",
      address: "",
    });
    
    setTransporters(getTransporters());
  };

  return (
    <div className="min-h-screen bg-ag-beige">
      <Navigation title="Master Data" showBackButton />
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="agents" className="data-[state=active]:bg-F2FCE2">
              Agents
            </TabsTrigger>
            <TabsTrigger value="brokers" className="data-[state=active]:bg-F2FCE2">
              Brokers
            </TabsTrigger>
            <TabsTrigger value="customers" className="data-[state=active]:bg-F2FCE2">
              Customers
            </TabsTrigger>
            <TabsTrigger value="transporters" className="data-[state=active]:bg-F2FCE2">
              Transporters
            </TabsTrigger>
          </TabsList>
          
          {/* Agents Tab Content */}
          <TabsContent value="agents">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Add Agent</CardTitle>
                  <CardDescription>
                    Enter details to add a new agent to your system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAgentSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="agent-name">
                        <span className="text-red-500">*</span> Name
                      </Label>
                      <Input 
                        id="agent-name" 
                        name="name" 
                        value={agentForm.name} 
                        onChange={handleAgentChange} 
                        placeholder="Agent name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agent-contact">
                        <span className="text-red-500">*</span> Contact Number
                      </Label>
                      <Input 
                        id="agent-contact" 
                        name="contactNumber" 
                        value={agentForm.contactNumber} 
                        onChange={handleAgentChange} 
                        placeholder="Phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agent-address">Address</Label>
                      <Input 
                        id="agent-address" 
                        name="address" 
                        value={agentForm.address} 
                        onChange={handleAgentChange} 
                        placeholder="Address"
                      />
                    </div>
                    <Button type="submit" className="w-full">Add Agent</Button>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Agents List</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Address</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {agents.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                              No agents found
                            </TableCell>
                          </TableRow>
                        ) : (
                          agents.map(agent => (
                            <TableRow key={agent.id}>
                              <TableCell className="font-medium">{agent.name}</TableCell>
                              <TableCell>{agent.contactNumber}</TableCell>
                              <TableCell>{agent.address || "-"}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Brokers Tab Content */}
          <TabsContent value="brokers">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Add Broker</CardTitle>
                  <CardDescription>
                    Enter details to add a new broker to your system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleBrokerSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="broker-name">
                        <span className="text-red-500">*</span> Name
                      </Label>
                      <Input 
                        id="broker-name" 
                        name="name" 
                        value={brokerForm.name} 
                        onChange={handleBrokerChange} 
                        placeholder="Broker name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="broker-contact">
                        <span className="text-red-500">*</span> Contact Number
                      </Label>
                      <Input 
                        id="broker-contact" 
                        name="contactNumber" 
                        value={brokerForm.contactNumber} 
                        onChange={handleBrokerChange} 
                        placeholder="Phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="broker-address">Address</Label>
                      <Input 
                        id="broker-address" 
                        name="address" 
                        value={brokerForm.address} 
                        onChange={handleBrokerChange} 
                        placeholder="Address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="broker-commission">Commission Rate (%)</Label>
                      <Input 
                        id="broker-commission" 
                        name="commissionRate" 
                        type="number" 
                        min="0" 
                        step="0.1" 
                        value={brokerForm.commissionRate} 
                        onChange={handleBrokerChange} 
                        placeholder="1.0"
                      />
                    </div>
                    <Button type="submit" className="w-full">Add Broker</Button>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Brokers List</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Commission</TableHead>
                          <TableHead>Address</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {brokers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                              No brokers found
                            </TableCell>
                          </TableRow>
                        ) : (
                          brokers.map(broker => (
                            <TableRow key={broker.id}>
                              <TableCell className="font-medium">{broker.name}</TableCell>
                              <TableCell>{broker.contactNumber}</TableCell>
                              <TableCell>{broker.commissionRate}%</TableCell>
                              <TableCell>{broker.address || "-"}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Customers Tab Content */}
          <TabsContent value="customers">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Add Customer</CardTitle>
                  <CardDescription>
                    Enter details to add a new customer to your system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCustomerSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="customer-name">
                        <span className="text-red-500">*</span> Name
                      </Label>
                      <Input 
                        id="customer-name" 
                        name="name" 
                        value={customerForm.name} 
                        onChange={handleCustomerChange} 
                        placeholder="Customer name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customer-contact">
                        <span className="text-red-500">*</span> Contact Number
                      </Label>
                      <Input 
                        id="customer-contact" 
                        name="contactNumber" 
                        value={customerForm.contactNumber} 
                        onChange={handleCustomerChange} 
                        placeholder="Phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customer-address">Address</Label>
                      <Input 
                        id="customer-address" 
                        name="address" 
                        value={customerForm.address} 
                        onChange={handleCustomerChange} 
                        placeholder="Address"
                      />
                    </div>
                    <Button type="submit" className="w-full">Add Customer</Button>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Customers List</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Address</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                              No customers found
                            </TableCell>
                          </TableRow>
                        ) : (
                          customers.map(customer => (
                            <TableRow key={customer.id}>
                              <TableCell className="font-medium">{customer.name}</TableCell>
                              <TableCell>{customer.contactNumber}</TableCell>
                              <TableCell>{customer.address || "-"}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Transporters Tab Content */}
          <TabsContent value="transporters">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Add Transporter</CardTitle>
                  <CardDescription>
                    Enter details to add a new transporter to your system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleTransporterSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="transporter-name">
                        <span className="text-red-500">*</span> Name
                      </Label>
                      <Input 
                        id="transporter-name" 
                        name="name" 
                        value={transporterForm.name} 
                        onChange={handleTransporterChange} 
                        placeholder="Transporter name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transporter-contact">
                        <span className="text-red-500">*</span> Contact Number
                      </Label>
                      <Input 
                        id="transporter-contact" 
                        name="contactNumber" 
                        value={transporterForm.contactNumber} 
                        onChange={handleTransporterChange} 
                        placeholder="Phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transporter-address">Address</Label>
                      <Input 
                        id="transporter-address" 
                        name="address" 
                        value={transporterForm.address} 
                        onChange={handleTransporterChange} 
                        placeholder="Address"
                      />
                    </div>
                    <Button type="submit" className="w-full">Add Transporter</Button>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Transporters List</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Address</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transporters.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                              No transporters found
                            </TableCell>
                          </TableRow>
                        ) : (
                          transporters.map(transporter => (
                            <TableRow key={transporter.id}>
                              <TableCell className="font-medium">{transporter.name}</TableCell>
                              <TableCell>{transporter.contactNumber}</TableCell>
                              <TableCell>{transporter.address || "-"}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Master;
