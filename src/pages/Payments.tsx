
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
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
import { 
  getPayments, 
  addPayment,
  updatePayment,
  deletePayment,
} from "@/services/storageService";
import { Edit, Trash2, RefreshCw, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import PaymentForm from "@/components/PaymentForm";
import { 
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";
import { formatDate } from "@/utils/helpers";

const Payments = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null);
  const [editingPayment, setEditingPayment] = useState<any | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setIsRefreshing(true);
    
    try {
      const freshPayments = getPayments().filter(p => !p.isDeleted);
      setPayments(freshPayments);
      console.log("Payments data refreshed:", freshPayments);
    } catch (err) {
      console.error("Error loading payments data:", err);
      toast.error("Failed to load payments data");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAdd = (data: any) => {
    try {
      addPayment(data);
      loadData();
      toast.success("Payment added successfully");
      setIsAddDialogOpen(false);
    } catch (err) {
      console.error("Error adding payment:", err);
      toast.error("Failed to add payment");
    }
  };

  const handleEdit = (payment: any) => {
    setEditingPayment(payment);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (updatedPayment: any) => {
    if (!editingPayment) return;
    
    try {
      updatePayment(updatedPayment);
      loadData();
      toast.success("Payment updated successfully");
      setIsEditDialogOpen(false);
      setEditingPayment(null);
    } catch (err) {
      console.error("Error updating payment:", err);
      toast.error("Failed to update payment");
    }
  };

  const confirmDeletePayment = (id: string) => {
    setPaymentToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = () => {
    if (!paymentToDelete) return;
    
    try {
      deletePayment(paymentToDelete);
      loadData();
      toast.success("Payment deleted successfully");
    } catch (err) {
      console.error("Error deleting payment:", err);
      toast.error("Failed to delete payment");
    } finally {
      setShowDeleteConfirm(false);
      setPaymentToDelete(null);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation title="Payments" showBackButton={true} />
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Payment Entries</h1>
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
                  <Plus size={18} className="mr-1" /> Add Payment
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90vw] max-w-[900px] max-h-[90vh] overflow-hidden p-0">
                <DialogHeader className="px-6 pt-6">
                  <DialogTitle>Add New Payment</DialogTitle>
                  <DialogDescription>
                    Fill in the details to record a new payment
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[calc(90vh-130px)] px-6 py-4">
                  <PaymentForm onSubmit={handleAdd} onCancel={() => setIsAddDialogOpen(false)} />
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setEditingPayment(null);
        }}>
          <DialogContent className="w-[90vw] max-w-[900px] max-h-[90vh] overflow-hidden p-0">
            <DialogHeader className="px-6 pt-6">
              <DialogTitle>Edit Payment</DialogTitle>
              <DialogDescription>
                Modify the payment details
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[calc(90vh-130px)] px-6 py-4">
                <PaymentForm 
                  onSubmit={handleUpdate} 
                  onCancel={() => setIsEditDialogOpen(false)}
                  initialData={editingPayment}
                />
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this payment? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setShowDeleteConfirm(false);
                setPaymentToDelete(null);
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
          {payments.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No payments recorded yet. Add your first payment.</p>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <ScrollArea className="h-[calc(100vh-220px)]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky top-0 bg-white">Date</TableHead>
                      <TableHead className="sticky top-0 bg-white">Party Type</TableHead>
                      <TableHead className="sticky top-0 bg-white">Party</TableHead>
                      <TableHead className="sticky top-0 bg-white">Amount (₹)</TableHead>
                      <TableHead className="sticky top-0 bg-white">Payment Mode</TableHead>
                      <TableHead className="sticky top-0 bg-white">Bill Number</TableHead>
                      <TableHead className="sticky top-0 bg-white">Bill Amount (₹)</TableHead>
                      <TableHead className="sticky top-0 bg-white">Reference Number</TableHead>
                      <TableHead className="sticky top-0 bg-white">Notes</TableHead>
                      <TableHead className="sticky top-0 bg-white">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{formatDate(payment.date)}</TableCell>
                        <TableCell>{payment.partyType}</TableCell>
                        <TableCell>{payment.partyName}</TableCell>
                        <TableCell>{payment.amount}</TableCell>
                        <TableCell>{payment.paymentMode}</TableCell>
                        <TableCell>{payment.billNumber || "-"}</TableCell>
                        <TableCell>{payment.billAmount ? payment.billAmount.toFixed(2) : "0.00"}</TableCell>
                        <TableCell>{payment.referenceNumber || "-"}</TableCell>
                        <TableCell>{payment.notes || "-"}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEdit(payment)}
                              title="Edit payment"
                            >
                              <Edit size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => confirmDeletePayment(payment.id)}
                              className="text-red-500 hover:text-red-700"
                              title="Delete payment"
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
        </div>
      </div>
    </div>
  );
};

export default Payments;
