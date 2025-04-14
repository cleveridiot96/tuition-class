
import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Printer, Download, BarChart } from "lucide-react";
import StockReport from "@/components/StockReport";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("stock");

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Export functionality will be implemented later
    console.log("Export report");
  };

  return (
    <div className="min-h-screen bg-ag-beige">
      <Navigation title="रिपोर्ट्स (Reports)" showBackButton />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <BarChart className="mr-2" /> Reports Dashboard
          </h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handlePrint}
              className="flex items-center gap-1"
            >
              <Printer size={16} />
              Print
            </Button>
            <Button 
              size="sm"
              onClick={handleExport}
              className="flex items-center gap-1"
            >
              <Download size={16} />
              Export
            </Button>
          </div>
        </div>

        <Card className="p-6">
          <Tabs defaultValue="stock" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="stock">Stock</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="purchases">Purchases</TabsTrigger>
            </TabsList>

            <TabsContent value="stock" className="pt-4">
              <StockReport />
            </TabsContent>

            <TabsContent value="financial" className="pt-4">
              <div className="text-center p-12">
                <p className="text-lg text-gray-500">Financial reports coming soon</p>
              </div>
            </TabsContent>

            <TabsContent value="sales" className="pt-4">
              <div className="text-center p-12">
                <p className="text-lg text-gray-500">Sales reports coming soon</p>
              </div>
            </TabsContent>

            <TabsContent value="purchases" className="pt-4">
              <div className="text-center p-12">
                <p className="text-lg text-gray-500">Purchase reports coming soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
