import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import SalesForm from "@/components/SalesForm";
import MultiItemSalesForm from "@/components/sales/MultiItemSalesForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { toast } from "sonner";
import { PlusCircle, Edit, Trash2, RefreshCw, PrinterIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getSales, addSale, updateSale, deleteSale, updateInventoryAfterSale, getInventory } from "@/services/storageService";
import { useReactToPrint } from "react-to-print";
import SalesReceipt from "@/components/SalesReceipt";
import { getSaleIdFromUrl } from "@/utils/helpers";
import { normalizeSale, normalizeSales } from "@/utils/typeNormalizers";
import { Sale } from "@/services/types";
import SalesTable from "./sales/SalesTable";
import DeletedSalesTable from "./sales/DeletedSalesTable";
import SalesDialogs from "./sales/SalesDialogs";
import { useSalesActionHandlers } from "./sales/SalesActionHandlers";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [deletedSales, setDeletedSales] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false);

  const {
    isRefreshing,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    showDeleteConfirm,
    setShowDeleteConfirm,
    saleToDelete,
    setSaleToDelete,
    editingSale,
    setEditingSale,
    saleToPrint,
    setSaleToPrint,
    isPrintDialogOpen,
    setIsPrintDialogOpen,
    printRef,
    handleEdit,
    handleAdd,
    handleUpdate,
    confirmDeleteSale,
    handleDelete,
    handleRestoreSale,
    handlePrintSale,
    loadData,
    handleCloseDialog,
    handlePrint
  } = useSalesActionHandlers(setSales, setDeletedSales);

  useEffect(() => {
    loadData();
    const saleId = getSaleIdFromUrl();
    if (saleId) {
      const allSales = getSales() || [];
      const targetSale = allSales.find(s => s.id === saleId && !s.isDeleted);
      if (targetSale) {
        handleEdit(normalizeSale(targetSale));
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <Navigation title="Sales" showBackButton />
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-gradient-to-br from-green-100 to-green-200 border-green-200 shadow">
          <CardHeader>
            <CardTitle className="text-green-800">Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold">Sales Register</h1>
                <Button 
                  variant={showDeleted ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowDeleted(!showDeleted)}
                  className="flex items-center gap-1"
                >
                  {showDeleted ? "Hide Deleted" : "Show Deleted"}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline"
                  size="icon"
                  onClick={loadData}
                  disabled={isRefreshing}
                  title="Refresh data"
                  className="mr-2"
                >
                  <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
                </Button>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <PlusCircle size={18} className="mr-1" /> Add Sale
                </Button>
              </div>
            </div>
            <SalesDialogs
              isAddDialogOpen={isAddDialogOpen}
              setIsAddDialogOpen={setIsAddDialogOpen}
              isEditDialogOpen={isEditDialogOpen}
              setIsEditDialogOpen={setIsEditDialogOpen}
              editingSale={editingSale}
              handleAdd={handleAdd}
              handleUpdate={handleUpdate}
              handleCloseDialog={handleCloseDialog}
              handlePrintSale={handlePrintSale}
              isPrintDialogOpen={isPrintDialogOpen}
              setIsPrintDialogOpen={setIsPrintDialogOpen}
              saleToPrint={saleToPrint}
              printRef={printRef}
              showDeleteConfirm={showDeleteConfirm}
              setShowDeleteConfirm={setShowDeleteConfirm}
              saleToDelete={saleToDelete}
              handleDelete={() => handleDelete(sales)}
            />
            <div className="space-y-4">
              {showDeleted ? (
                <DeletedSalesTable
                  deletedSales={deletedSales}
                  onRestore={(id) => handleRestoreSale(id, deletedSales)}
                />
              ) : (
                <SalesTable
                  sales={sales}
                  onEdit={handleEdit}
                  onDelete={confirmDeleteSale}
                  onPrint={handlePrintSale}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Sales;
