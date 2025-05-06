
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMasters } from "@/services/masterService";
import { MasterForm } from "@/components/master/MasterForm";
import { MastersList } from "@/components/master/MastersList";
import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MasterType } from "@/types/master.types";

const AUTO_REFRESH_INTERVAL = 1000; // 1 second refresh interval

const Master = () => {
  const [showForm, setShowForm] = useState(false);
  const [currentTab, setCurrentTab] = useState<"all" | MasterType>("all");
  const [masters, setMasters] = useState<any[]>([]);
  const [formType, setFormType] = useState<MasterType>("supplier");
  
  const loadData = useCallback(() => {
    try {
      // Load masters directly from the master service
      const allMasters = getMasters();
      // Filter out deleted masters
      const activeMasters = allMasters.filter(m => !m.isDeleted);
      setMasters(activeMasters);
    } catch (error) {
      console.error("Error loading masters:", error);
    }
  }, []);
  
  useEffect(() => {
    loadData();
    
    // Set up auto-refresh interval
    const refreshInterval = setInterval(() => {
      loadData();
    }, AUTO_REFRESH_INTERVAL);
    
    // Clean up interval on component unmount
    return () => clearInterval(refreshInterval);
  }, [loadData]);

  const handleTabChange = (value: string) => {
    setCurrentTab(value as "all" | MasterType);
    
    // Set form type based on the selected tab (except for "all")
    if (value !== "all") {
      setFormType(value as MasterType);
    }
  };

  // Filter masters by type based on current tab
  const filteredMasters = useMemo(() => {
    if (currentTab === "all") return masters;
    return masters.filter(master => master.type === currentTab);
  }, [currentTab, masters]);

  const handleAddMaster = () => {
    // Set the form type based on current tab (if not on "all" tab)
    if (currentTab !== "all") {
      setFormType(currentTab);
    }
    setShowForm(true);
  };

  const handleFormSave = () => {
    setShowForm(false);
    // Immediately load data after save to show the new master
    loadData();
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
              onClick={handleAddMaster} 
              className="mb-4 bg-indigo-600 hover:bg-indigo-700"
            >
              + Add Master
            </Button>

            {showForm && (
              <MasterForm
                onClose={() => setShowForm(false)}
                onSaved={handleFormSave}
                initialType={formType}
              />
            )}

            <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid grid-cols-6 mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="supplier">Suppliers</TabsTrigger>
                <TabsTrigger value="customer">Customers</TabsTrigger>
                <TabsTrigger value="broker">Brokers</TabsTrigger>
                <TabsTrigger value="agent">Agents</TabsTrigger>
                <TabsTrigger value="transporter">Transporters</TabsTrigger>
              </TabsList>
              
              <TabsContent value={currentTab}>
                <MastersList masters={filteredMasters} onUpdate={loadData} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Master;
