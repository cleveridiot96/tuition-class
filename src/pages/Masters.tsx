
import React from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MasterForm } from "@/components/master/MasterForm";

const Masters = () => {
  const [activeTab, setActiveTab] = React.useState("suppliers");
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  const handleFormSaved = () => {
    // Adding a placeholder for when form is saved
    setIsFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <Navigation title="Masters" showBackButton pageType="masters" />
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-white border-purple-200 shadow">
          <CardHeader>
            <CardTitle className="text-purple-800">Master Data Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="suppliers" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
                <TabsTrigger value="customers">Customers</TabsTrigger>
                <TabsTrigger value="agents">Agents</TabsTrigger>
                <TabsTrigger value="brokers">Brokers</TabsTrigger>
                <TabsTrigger value="transporters">Transporters</TabsTrigger>
              </TabsList>
              
              <TabsContent value="suppliers" className="space-y-4">
                <h2 className="text-lg font-semibold">Add New Supplier</h2>
                <MasterForm onClose={handleFormClose} onSaved={handleFormSaved} initialType="supplier" />
              </TabsContent>
              
              <TabsContent value="customers" className="space-y-4">
                <h2 className="text-lg font-semibold">Add New Customer</h2>
                <MasterForm onClose={handleFormClose} onSaved={handleFormSaved} initialType="customer" />
              </TabsContent>
              
              <TabsContent value="agents" className="space-y-4">
                <h2 className="text-lg font-semibold">Add New Agent</h2>
                <MasterForm onClose={handleFormClose} onSaved={handleFormSaved} initialType="agent" />
              </TabsContent>
              
              <TabsContent value="brokers" className="space-y-4">
                <h2 className="text-lg font-semibold">Add New Broker</h2>
                <MasterForm onClose={handleFormClose} onSaved={handleFormSaved} initialType="broker" />
              </TabsContent>
              
              <TabsContent value="transporters" className="space-y-4">
                <h2 className="text-lg font-semibold">Add New Transporter</h2>
                <MasterForm onClose={handleFormClose} onSaved={handleFormSaved} initialType="transporter" />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Masters;
