
import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SalesTable from "./sales/SalesTable";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { getSales, getInventory, getCustomers, getBrokers, getTransporters } from "@/services/storageService";
import { Sale } from "@/services/types";
import { 
  handlePrintSale, 
  handleEditSale, 
  handleDeleteSale, 
  handleSaleSubmit, 
  handleUpdateInventoryAfterSale,
} from "./sales/SalesActionHandlers";
import ContinuousSalesForm from "@/components/sales/ContinuousSalesForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DeletedSalesTable from "./sales/DeletedSalesTable";

const Sales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [inventory, setInventory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const salesData = getSales() || [];
    setSales(salesData);
    setInventory(getInventory() || []);
  };

  const filterSales = (sales: Sale[]) => {
    if (activeTab === "deleted") {
      return sales.filter((s) => s.isDeleted);
    } else {
      return sales.filter((s) => !s.isDeleted);
    }
  };

  const handleRestoreSale = (id: string) => {
    const updatedSales = sales.map(sale => 
      sale.id === id ? { ...sale, isDeleted: false } : sale
    );
    setSales(updatedSales);
    // Update storage with restored sale
    const storageService = require('@/services/storageService');
    storageService.saveSales(updatedSales);
    
    // Update UI and show success message
    loadData();
    
    const { toast } = require('sonner');
    toast.success("Sale restored successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <Navigation title="Sales" showBackButton className="sticky top-0 z-10 bg-purple-700 text-white shadow-md" />
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-gradient-to-br from-purple-100 to-purple-200 border-purple-200 shadow">
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <CardTitle className="text-purple-800">Sales</CardTitle>
            {!isAdding && (
              <Button
                onClick={() => {
                  setIsAdding(true);
                  setEditingSale(null);
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Sale
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {isAdding ? (
              <ContinuousSalesForm
                onCancel={() => {
                  setIsAdding(false);
                  setEditingSale(null);
                }}
                onSubmit={(sale) => {
                  handleSaleSubmit(
                    sale,
                    sales,
                    setSales,
                    setIsAdding,
                    setEditingSale,
                    inventory,
                    setInventory
                  );
                }}
                initialSale={editingSale}
              />
            ) : (
              <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="active">Active Sales</TabsTrigger>
                  <TabsTrigger value="deleted">Deleted Sales</TabsTrigger>
                </TabsList>
                <TabsContent value="active">
                  <SalesTable
                    sales={filterSales(sales)}
                    onDelete={(saleId) => {
                      handleDeleteSale(saleId, sales, setSales);
                    }}
                    onPrint={handlePrintSale}
                    onEdit={(sale) => {
                      handleEditSale(sale, setIsAdding, setEditingSale);
                    }}
                  />
                </TabsContent>
                <TabsContent value="deleted">
                  <DeletedSalesTable 
                    deletedSales={filterSales(sales)} 
                    onRestore={handleRestoreSale} 
                  />
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Sales;
