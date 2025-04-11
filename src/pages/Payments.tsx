
import React, { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast"; // Using our custom toast
import Navigation from "@/components/Navigation";
import { 
  getPayments, 
  addPayment,
  updatePayment,
  deletePayment,
} from "@/services/storageService";

// Import the components
import PaymentsHeader from "@/components/payments/PaymentsHeader";
import PaymentsTable from "@/components/payments/PaymentsTable";
import AddPaymentDialog from "@/components/payments/AddPaymentDialog";
import EditPaymentDialog from "@/components/payments/EditPaymentDialog";
import DeleteConfirmDialog from "@/components/payments/DeleteConfirmDialog";

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
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <PaymentsHeader 
            onRefresh={loadData} 
            isRefreshing={isRefreshing}
          />
          
          <div className="space-y-4">
            <PaymentsTable 
              payments={payments} 
              onEdit={handleEdit}
              onDelete={confirmDeletePayment} 
            />
          </div>

          <AddPaymentDialog
            open={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onSubmit={handleAdd}
          />
        </Dialog>

        <EditPaymentDialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) setEditingPayment(null);
          }}
          payment={editingPayment}
          onSubmit={handleUpdate}
        />

        <DeleteConfirmDialog
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default Payments;
