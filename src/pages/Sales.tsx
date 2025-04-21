import React from "react";
import Navigation from "@/components/Navigation";
import SalesForm from "@/components/SalesForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [saleToPrint, setSaleToPrint] = useState<Sale | null>(null);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Sale Receipt ${saleToPrint?.billNumber || saleToPrint?.id || ""}`,
    onAfterPrint: () => {
      setIsPrintDialogOpen(false);
      setSaleToPrint(null);
    },
  });

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

  const loadData = () => {
    setIsRefreshing(true);
    
    try {
      const allSales = getSales() || [];
      const activeSales = normalizeSales(allSales.filter(s => !s.isDeleted));
      const deletedSalesData = normalizeSales(allSales.filter(s => s.isDeleted));
      
      setSales(activeSales);
      setDeletedSales(deletedSalesData);
      
      console.log("Sales data refreshed:", activeSales);
    } catch (err) {
      console.error("Error loading sales data:", err);
      toast.error("Failed to load sales data");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAdd = (data: Sale) => {
    try {
      const normalizedSale = normalizeSale({
        ...data,
        amount: data.totalAmount,
        transportCost: data.transportCost || 0,
      });
      
      addSale(normalizedSale);
      
      updateInventoryAfterSale(data.lotNumber, data.quantity);
      
      loadData();
      toast.success("Sale added successfully");
      setIsAddDialogOpen(false);
    } catch (err) {
      console.error("Error adding sale:", err);
      toast.error("Failed to add sale");
    }
  };

  const handleEdit = (sale: Sale) => {
    setEditingSale(sale);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (updatedSale: Sale) => {
    if (!editingSale) return;
    
    try {
      const normalizedSale = normalizeSale({
        ...updatedSale,
        amount: updatedSale.totalAmount,
        transportCost: updatedSale.transportCost || 0,
      });
      
      if (updatedSale.quantity !== editingSale.quantity || updatedSale.lotNumber !== editingSale.lotNumber) {
        updateInventoryAfterSale(editingSale.lotNumber, -editingSale.quantity);
        updateInventoryAfterSale(updatedSale.lotNumber, updatedSale.quantity);
      }
      
      updateSale(normalizedSale);
      
      loadData();
      
      toast.success("Sale updated successfully");
      setIsEditDialogOpen(false);
      setEditingSale(null);
    } catch (err) {
      console.error("Error updating sale:", err);
      toast.error("Failed to update sale");
    }
  };

  const confirmDeleteSale = (id: string) => {
    setSaleToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = () => {
    if (!saleToDelete) return;
    
    try {
      const saleToRemove = sales.find(s => s.id === saleToDelete);
      if (saleToRemove) {
        updateInventoryAfterSale(saleToRemove.lotNumber, -saleToRemove.quantity);
        deleteSale(saleToDelete);
        
        loadData();
        
        toast.success("Sale deleted successfully");
      }
    } catch (err) {
      console.error("Error deleting sale:", err);
      toast.error("Failed to delete sale");
    } finally {
      setShowDeleteConfirm(false);
      setSaleToDelete(null);
    }
  };

  const handleRestoreSale = (id: string) => {
    try {
      const saleToRestore = deletedSales.find(s => s.id === id);
      if (!saleToRestore) return;
      
      const inventory = getInventory() || [];
      const lotItem = inventory.find(item => item.lotNumber === saleToRestore.lotNumber && !item.isDeleted);
      
      if (!lotItem) {
        toast.error(`Cannot restore sale: Lot ${saleToRestore.lotNumber} no longer exists in inventory.`);
        return;
      }
      
      if (lotItem.quantity < saleToRestore.quantity) {
        toast.error(`Cannot restore sale: Only ${lotItem.quantity} bags available in lot ${saleToRestore.lotNumber}.`);
        return;
      }
      
      const updatedSale = { 
        ...saleToRestore, 
        isDeleted: false,
        amount: saleToRestore.totalAmount,
        transportCost: saleToRestore.transportCost || 0,
      };
      
      updateSale(updatedSale);
      
      updateInventoryAfterSale(saleToRestore.lotNumber, saleToRestore.quantity);
      
      loadData();
      
      toast.success("Sale restored successfully");
    } catch (err) {
      console.error("Error restoring sale:", err);
      toast.error("Failed to restore sale");
    }
  };

  const handlePrintSale = (sale: Sale) => {
    setSaleToPrint(sale);
    setIsPrintDialogOpen(true);
    
    setTimeout(() => {
      if (printRef.current) {
        handlePrint();
      }
    }, 300);
  };

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
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle size={18} className="mr-1" /> Add Sale
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[90vw] max-w-[900px] max-h-[90vh] overflow-hidden p-0">
                    <DialogHeader className="px-6 pt-6">
                      <DialogTitle>Add New Sale</DialogTitle>
                      <DialogDescription>Fill in the details to record a new sale</DialogDescription>
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
                  <DialogDescription>Modify the sale details</DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[calc(90vh-130px)] px-6 py-4">
                  {editingSale && (
                    <SalesForm 
                      onSubmit={handleUpdate} 
                      initialData={editingSale} 
                      onPrint={() => {
                        setIsEditDialogOpen(false);
                        setTimeout(() => handlePrintSale(editingSale), 300);
                      }}
                    />
                  )}
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

            <Dialog 
              open={isPrintDialogOpen} 
              onOpenChange={setIsPrintDialogOpen}
            >
              <DialogContent className="w-[90vw] max-w-[800px] max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>Print Sale Receipt</DialogTitle>
                  <DialogDescription>Preview the sales receipt before printing</DialogDescription>
                </DialogHeader>
                <div ref={printRef} className="p-4 bg-white">
                  {saleToPrint && <SalesReceipt sale={saleToPrint} />}
                </div>
                <DialogFooter>
                  <Button onClick={handlePrint}>Print Now</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="space-y-4">
              {showDeleted ? (
                <div className="border rounded-md p-4 bg-white">
                  <h2 className="text-lg font-semibold mb-4">Deleted Sales</h2>
                  {deletedSales.length === 0 ? (
                    <p className="text-center py-8 text-gray-500">No deleted sales found.</p>
                  ) : (
                    <ScrollArea className="h-[calc(100vh-300px)]">
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
                          {(deletedSales || []).map((sale) => (
                            <TableRow key={sale.id} className="bg-red-50">
                              <TableCell>{format(new Date(sale.date), "dd MMM yyyy")}</TableCell>
                              <TableCell>{sale.lotNumber}</TableCell>
                              <TableCell>{sale.customer}</TableCell>
                              <TableCell>{sale.quantity}</TableCell>
                              <TableCell>{sale.netWeight}</TableCell>
                              <TableCell>₹{sale.rate}</TableCell>
                              <TableCell>₹{sale.totalAmount?.toFixed(2) || "0.00"}</TableCell>
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
                    </ScrollArea>
                  )}
                </div>
              ) : (
                <>
                  {sales.length === 0 ? (
                    <p className="text-center py-8 text-gray-500">No sales recorded yet. Add your first sale.</p>
                  ) : (
                    <div className="border rounded-md overflow-hidden bg-white">
                      <ScrollArea className="h-[calc(100vh-220px)]">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="sticky top-0 bg-white z-10">Date</TableHead>
                              <TableHead className="sticky top-0 bg-white z-10">Lot Number</TableHead>
                              <TableHead className="sticky top-0 bg-white z-10">Customer</TableHead>
                              <TableHead className="sticky top-0 bg-white z-10">Quantity</TableHead>
                              <TableHead className="sticky top-0 bg-white z-10">Net Weight</TableHead>
                              <TableHead className="sticky top-0 bg-white z-10">Rate</TableHead>
                              <TableHead className="sticky top-0 bg-white z-10">Total</TableHead>
                              <TableHead className="sticky top-0 bg-white z-10">Bill Amt</TableHead>
                              <TableHead className="sticky top-0 bg-white z-10">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {(sales || []).map((sale) => (
                              <TableRow key={sale.id}>
                                <TableCell>{format(new Date(sale.date), "dd MMM yyyy")}</TableCell>
                                <TableCell>{sale.lotNumber}</TableCell>
                                <TableCell>{sale.customer}</TableCell>
                                <TableCell>{sale.quantity}</TableCell>
                                <TableCell>{sale.netWeight}</TableCell>
                                <TableCell>₹{sale.rate}</TableCell>
                                <TableCell>₹{sale.totalAmount?.toFixed(2) || "0.00"}</TableCell>
                                <TableCell>₹{sale.billAmount?.toFixed(2) || "0.00"}</TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => handleEdit(sale)}
                                      title="Edit"
                                    >
                                      <Edit size={16} />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => handlePrintSale(sale)}
                                      title="Print"
                                    >
                                      <PrinterIcon size={16} />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => confirmDeleteSale(sale.id)}
                                      className="text-red-500 hover:text-red-700"
                                      title="Delete"
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Sales;
