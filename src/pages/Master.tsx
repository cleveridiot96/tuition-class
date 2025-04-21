
import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getSuppliers, getCustomers, getTransporters, getAgents, getBrokers } from "@/services/storageService";
import SupplierForm from "@/components/master/SupplierForm";
import CustomerForm from "@/components/master/CustomerForm";
import TransporterForm from "@/components/master/TransporterForm";
import AgentForm from "@/components/master/AgentForm";
import BrokerForm from "@/components/master/BrokerForm";
import SupplierTable from "@/components/master/SupplierTable";
import CustomerTable from "@/components/master/CustomerTable";
import TransporterTable from "@/components/master/TransporterTable";
import AgentTable from "@/components/master/AgentTable";
import BrokerTable from "@/components/master/BrokerTable";

const Master = () => {
  const [activeTab, setActiveTab] = useState("suppliers");
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [transporters, setTransporters] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [brokers, setBrokers] = useState<any[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setSuppliers(getSuppliers());
    setCustomers(getCustomers());
    setTransporters(getTransporters());
    setAgents(getAgents());
    setBrokers(getBrokers());
  };

  const handleAddClick = () => {
    setEditingItem(null);
    setShowAddDialog(true);
  };

  const handleEditClick = (item: any) => {
    setEditingItem(item);
    setShowAddDialog(true);
  };

  const handleDialogClose = () => {
    setShowAddDialog(false);
    setEditingItem(null);
    loadData();
  };

  const renderForm = () => {
    switch (activeTab) {
      case "suppliers":
        return <SupplierForm onClose={handleDialogClose} initialData={editingItem} />;
      case "customers":
        return <CustomerForm onClose={handleDialogClose} initialData={editingItem} />;
      case "transporters":
        return <TransporterForm onClose={handleDialogClose} initialData={editingItem} />;
      case "agents":
        return <AgentForm onClose={handleDialogClose} initialData={editingItem} />;
      case "brokers":
        return <BrokerForm onClose={handleDialogClose} initialData={editingItem} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100">
      <Navigation title="Master Data" showBackButton />
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-gradient-to-br from-indigo-100 to-indigo-200 border-indigo-200 shadow">
          <CardHeader>
            <CardTitle className="text-indigo-800">Master Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
                  <TabsTrigger value="customers">Customers</TabsTrigger>
                  <TabsTrigger value="transporters">Transporters</TabsTrigger>
                  <TabsTrigger value="agents">Agents</TabsTrigger>
                  <TabsTrigger value="brokers">Brokers</TabsTrigger>
                </TabsList>

                <TabsContent value="suppliers">
                  <SupplierTable suppliers={suppliers} onEdit={handleEditClick} onRefresh={loadData} />
                </TabsContent>
                <TabsContent value="customers">
                  <CustomerTable customers={customers} onEdit={handleEditClick} onRefresh={loadData} />
                </TabsContent>
                <TabsContent value="transporters">
                  <TransporterTable transporters={transporters} onEdit={handleEditClick} onRefresh={loadData} />
                </TabsContent>
                <TabsContent value="agents">
                  <AgentTable agents={agents} onEdit={handleEditClick} onRefresh={loadData} />
                </TabsContent>
                <TabsContent value="brokers">
                  <BrokerTable brokers={brokers} onEdit={handleEditClick} onRefresh={loadData} />
                </TabsContent>
              </Tabs>
              <Button onClick={handleAddClick} className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="mr-2 h-4 w-4" /> Add New
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit" : "Add"} {activeTab.slice(0, -1)}
            </DialogTitle>
          </DialogHeader>
          {renderForm()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Master;
