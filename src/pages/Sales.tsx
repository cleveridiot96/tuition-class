
import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
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
import { PlusCircle, Edit, Trash2, RefreshCw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import SalesForm from "@/components/SalesForm";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";
import {
  getSales,
  addSale,
  updateSale,
  deleteSale,
  updateInventoryAfterSale,
  getInventory,
} from "@/services/storageService";

interface Sale {
  id: string;
  date: string;
  lotNumber: string;
  billNumber?: string;
  billAmount?: number;
  customer: string;
  customerId: string;
  quantity: number;
  netWeight: number;
  rate: number;
  broker?: string;
  brokerId?: string;
  transporter: string;
  transporterId: string;
  transportRate: number;
  location: string;
  notes?: string;
  totalAmount: number;
  transportCost: number;
  netAmount: number;
  isDeleted?: boolean;
}

const Sales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState<string | null>(null);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deletedSales, setDeletedSales] = useState<Sale[]>([]);
  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setIsRefreshing(true);
    
    const allSales = getSales();
    const activeSales = allSales.filter(s => !s.isDeleted);
    const deletedSalesData = allSales.filter(s => s.isDeleted);
    
    setSales(activeSales);
    setDeletedSales(deletedSalesData);
    
    setIsRefreshing(false);
    console.log("Sales data refreshed:", activeSales);
  };

  const handleAdd = (data: Sale) => {
    addSale(data);
    
    // Update inventory
    updateInventoryAfterSale(data.lotNumber, data.quantity);
    
    loadData();
    toast.success("Sale added successfully");
    setIsAddDialogOpen(false);
  };

  const handleEdit = (sale: Sale) => {
    setEditingSale(sale);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (updatedSale: Sale) => {
    if (!editingSale) return;
    
    // If quantity changed, we need to adjust inventory
    if (updatedSale.quantity !== editingSale.quantity) {
      // First restore original quantity
      updateInventoryAfterSale(editingSale.lotNumber, -editingSale.quantity);
      
      // Then remove new quantity
      updateInventoryAfterSale(updatedSale.lotNumber, updatedSale.quantity);
    }
    
    // Update sale in storage
    updateSale(updatedSale);
    
    // Refresh data
    loadData();
    
    toast.success("Sale updated successfully");
    setIsEditDialogOpen(false);
    setEditingSale(null);
  };

  const confirmDeleteSale = (id: string) => {
    setSaleToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = () => {
    if (!saleToDelete) return;
    
    const saleToRemove = sales.find(s => s.id === saleToDelete);
    if (saleToRemove) {
      // Restore inventory quantity
      updateInventoryAfterSale(saleToRemove.lotNumber, -saleToRemove.quantity);
      
      // Mark sale as deleted
      deleteSale(saleToDelete);
      
      loadData();
      
      toast.success("Sale deleted successfully");
    }
    
    setShowDeleteConfirm(false);
    setSaleToDelete(null);
  };

  const handleRestoreSale = (id: string) => {
    const saleToRestore = deletedSales.find(s => s.id === id);
    if (!saleToRestore) return;
    
    // Check if we have enough inventory
    const inventory = getInventory();
    const lotItem = inventory.find(item => item.lotNumber === saleToRestore.lotNumber && !item.isDeleted);
    
    if (!lotItem) {
      toast.error(`Cannot restore sale: Lot ${saleToRestore.lotNumber} no longer exists in inventory.`);
      return;
    }
    
    if (lotItem.quantity < saleToRestore.quantity) {
      toast.error(`Cannot restore sale: Only ${lotItem.quantity} bags available in lot ${saleToRestore.lotNumber}.`);
      return;
    }
    
    // Restore the sale by removing isDeleted flag
    const updatedSale = { ...saleToRestore, isDeleted: false };
    updateSale(updatedSale);
    
    // Update inventory
    updateInventoryAfterSale(saleToRestore.lotNumber, saleToRestore.quantity);
    
    // Refresh data
    loadData();
    
    toast.success("Sale restored successfully");
  };

  return (
    <div className="min-h-screen">
      <Navigation title="Sales" showBackButton={true} />
      
      <div className="container mx-auto py-8 px-4">
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
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle size={18} className="mr-1" /> Add Sale
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90vw] max-w-[900px] max-h-[90vh] overflow-hidden p-0">
                <DialogHeader className="px-6 pt-6">
                  <DialogTitle>Add New Sale</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[calc(90vh-130px)] px-6 py-4">
                  <SalesForm onSubmit={handleAdd} />
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setEditingSale(null);
        }}>
          <DialogContent className="w-[90vw] max-w-[900px] max-h-[90vh] overflow-hidden p-0">
            <DialogHeader className="px-6 pt-6">
              <DialogTitle>Edit Sale</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[calc(90vh-130px)] px-6 py-4">
              {editingSale && <SalesForm onSubmit={handleUpdate} initialData={editingSale} />}
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this sale? This action will restore the quantity to inventory.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setShowDeleteConfirm(false);
                setSaleToDelete(null);
              }}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="space-y-4">
          {showDeleted ? (
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">Deleted Sales</h2>
              {deletedSales.length === 0 ? (
                <p className="text-center py-8 text-gray-500">No deleted sales found.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Lot Number</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Net Weight</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deletedSales.map((sale) => (
                      <TableRow key={sale.id} className="bg-red-50">
                        <TableCell>{format(new Date(sale.date), "dd MMM yyyy")}</TableCell>
                        <TableCell>{sale.lotNumber}</TableCell>
                        <TableCell>{sale.customer}</TableCell>
                        <TableCell>{sale.quantity}</TableCell>
                        <TableCell>{sale.netWeight}</TableCell>
                        <TableCell>₹{sale.rate}</TableCell>
                        <TableCell>₹{sale.totalAmount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRestoreSale(sale.id)}
                          >
                            Restore
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>
          ) : (
            <>
              {sales.length === 0 ? (
                <p className="text-center py-8 text-gray-500">No sales recorded yet. Add your first sale.</p>
              ) : (
                <div className="border rounded-md overflow-hidden">
                  <ScrollArea className="h-[calc(100vh-220px)]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="sticky top-0 bg-white">Date</TableHead>
                          <TableHead className="sticky top-0 bg-white">Lot Number</TableHead>
                          <TableHead className="sticky top-0 bg-white">Customer</TableHead>
                          <TableHead className="sticky top-0 bg-white">Quantity</TableHead>
                          <TableHead className="sticky top-0 bg-white">Net Weight</TableHead>
                          <TableHead className="sticky top-0 bg-white">Rate</TableHead>
                          <TableHead className="sticky top-0 bg-white">Amount</TableHead>
                          <TableHead className="sticky top-0 bg-white">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sales.map((sale) => (
                          <TableRow key={sale.id}>
                            <TableCell>{format(new Date(sale.date), "dd MMM yyyy")}</TableCell>
                            <TableCell>{sale.lotNumber}</TableCell>
                            <TableCell>{sale.customer}</TableCell>
                            <TableCell>{sale.quantity}</TableCell>
                            <TableCell>{sale.netWeight}</TableCell>
                            <TableCell>₹{sale.rate}</TableCell>
                            <TableCell>₹{sale.totalAmount.toFixed(2)}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleEdit(sale)}
                                >
                                  <Edit size={16} />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => confirmDeleteSale(sale.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sales;
