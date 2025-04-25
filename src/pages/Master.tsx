
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMasters, getSuppliers, getCustomers, getBrokers, getTransporters, getAgents } from "@/services/storageService";
import { MasterForm } from "@/components/master/MasterForm";
import { MastersList } from "@/components/master/MastersList";
import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Master = () => {
  const [showForm, setShowForm] = useState(false);
  const [currentTab, setCurrentTab] = useState("all");
  const [masters, setMasters] = useState<any[]>([]);
  
  const loadData = () => {
    // Load all masters from different sources and categorize them
    const suppliers = getSuppliers().map(s => ({...s, type: "supplier"}));
    const customers = getCustomers().map(c => ({...c, type: "customer"}));
    const brokers = getBrokers().map(b => ({...b, type: "broker"}));
    const transporters = getTransporters().map(t => ({...t, type: "transporter"}));
    const agents = getAgents().map(a => ({...a, type: "agent"}));
    
    // Combine all entities
    const allMasters = [...suppliers, ...customers, ...brokers, ...transporters, ...agents]
      .filter(m => !m.isDeleted);
      
    setMasters(allMasters);
  };
  
  useEffect(() => {
    loadData();
  }, []);

  const getFilteredMasters = () => {
    if (currentTab === "all") return masters;
    return masters.filter(master => master.type === currentTab);
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
            <Button 
              onClick={() => setShowForm(true)} 
              className="mb-4 bg-indigo-600 hover:bg-indigo-700"
            >
              + Add Master
            </Button>

            {showForm && (
              <MasterForm
                onClose={() => setShowForm(false)}
                onSaved={loadData}
              />
            )}

            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
              <TabsList className="grid grid-cols-6 mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="supplier">Suppliers</TabsTrigger>
                <TabsTrigger value="customer">Customers</TabsTrigger>
                <TabsTrigger value="broker">Brokers</TabsTrigger>
                <TabsTrigger value="agent">Agents</TabsTrigger>
                <TabsTrigger value="transporter">Transporters</TabsTrigger>
              </TabsList>
              
              <TabsContent value={currentTab}>
                <MastersList masters={getFilteredMasters()} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Master;
