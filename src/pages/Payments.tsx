
import React from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PaymentsTable from "@/components/payments/PaymentsTable";
import PaymentForm from "@/components/payments/PaymentForm";
import { useState, useEffect } from "react";
import { getPayments, addPayment, updatePayment, deletePayment } from "@/services/storageService";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { format } from 'date-fns';

const Payments = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<any>(null);
  const [sortColumn, setSortColumn] = useState<keyof any | null>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = () => {
    const paymentsData = getPayments() || [];
    // Sort payments by date (most recent first)
    const sortedPayments = [...paymentsData].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    setPayments(sortedPayments);
  };

  const handleAddPayment = (payment: any) => {
    addPayment(payment);
    loadPayments();
    setShowForm(false);
  };

  // Create a wrapper function to match the expected signature
  const handleUpdatePaymentWrapper = (updatedPayment: any) => {
    if (editingPayment && editingPayment.id) {
      handleUpdatePayment(editingPayment.id, updatedPayment);
    }
  };

  const handleUpdatePayment = (paymentId: string, updatedPayment: any) => {
    updatePayment(paymentId, updatedPayment);
    loadPayments();
    setEditingPayment(null);
    setShowForm(false);
  };

  const handleDeletePayment = (id: string) => {
    deletePayment(id);
    loadPayments();
  };

  const handleEditPayment = (payment: any) => {
    setEditingPayment(payment);
    setShowForm(true);
  };

  const handleSort = (column: keyof any) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedPayments = [...payments].sort((a, b) => {
    if (sortColumn) {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      <Navigation title="Payments" showBackButton />
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-gradient-to-br from-red-100 to-red-200 border-red-200 shadow">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-red-800">Payments</CardTitle>
            <Button onClick={() => { setShowForm(true); setEditingPayment(null); }} className="md-ripple bg-red-600 hover:bg-red-700 text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Payment
            </Button>
          </CardHeader>
          <CardContent>
            {showForm ? (
              <PaymentForm
                onSubmit={editingPayment ? handleUpdatePaymentWrapper : handleAddPayment}
                onCancel={() => { setShowForm(false); setEditingPayment(null); }}
                initialData={editingPayment}
              />
            ) : (
              <PaymentsTable
                payments={sortedPayments}
                onDelete={handleDeletePayment}
                onEdit={handleEditPayment}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payments;
