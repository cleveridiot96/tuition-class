
import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getPayments, addPayment, updatePayment } from "@/services/storageService";
import PaymentForm from "@/components/PaymentForm";

interface PaymentEntry {
  id: string;
  date: string;
  partyName: string;
  partyType: string;
  amount: number;
  paymentMode: string;
  billNumber?: string;
  billAmount?: number;
  referenceNumber?: string;
  notes?: string;
}

const Payments = () => {
  const { toast } = useToast();
  const [payments, setPayments] = useState<PaymentEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentEntry | null>(null);

  // Load payments from storage service
  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = () => {
    const storedPayments = getPayments() || [];
    setPayments(storedPayments);
  };

  const handleSubmit = (paymentData: any) => {
    if (editingPayment) {
      updatePayment(paymentData);
      toast({
        title: "Payment Updated",
        description: `Payment of ₹${paymentData.amount} to ${paymentData.partyName} updated successfully.`
      });
    } else {
      addPayment(paymentData);
      toast({
        title: "Payment Added",
        description: `Payment of ₹${paymentData.amount} to ${paymentData.partyName} added successfully.`
      });
    }
    
    loadPayments();
    setShowForm(false);
    setEditingPayment(null);
  };

  const handleAddNewClick = () => {
    setEditingPayment(null);
    setShowForm(true);
  };

  const handleEditPayment = (payment: PaymentEntry) => {
    setEditingPayment(payment);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-ag-beige">
      <Navigation title="Payments" showBackButton />
      <div className="container mx-auto px-4 py-6">
        {!showForm ? (
          <>
            <div className="flex justify-end mb-6">
              <Button
                onClick={handleAddNewClick}
                className="action-button flex gap-2 items-center"
              >
                <PlusCircle size={24} />
                New Payment
              </Button>
            </div>

            {payments.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-xl text-ag-brown">
                  No payments found. Click the button above to add a new payment.
                </p>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {payments.map((payment) => (
                  <Card key={payment.id} className="p-4 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleEditPayment(payment)}>
                    <div className="flex justify-between items-center border-b pb-2 mb-2">
                      <h3 className="text-xl font-bold">{payment.partyName}</h3>
                      <p className="text-ag-brown">{new Date(payment.date).toLocaleDateString()}</p>
                    </div>
                    <div className="mt-2">
                      <p className="text-2xl font-bold text-ag-green">₹ {payment.amount}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-3 py-1 rounded-full ${
                          payment.paymentMode === "cash" 
                            ? "bg-ag-orange text-white" 
                            : "bg-ag-green text-white"
                        }`}>
                          {payment.paymentMode && typeof payment.paymentMode === 'string' 
                            ? payment.paymentMode.charAt(0).toUpperCase() + payment.paymentMode.slice(1) 
                            : 'Unknown'}
                        </span>
                        {payment.referenceNumber && (
                          <span className="text-ag-brown">Ref: {payment.referenceNumber}</span>
                        )}
                      </div>
                    </div>
                    {payment.notes && (
                      <p className="mt-2 text-ag-brown">
                        <span className="font-semibold">Notes:</span> {payment.notes}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : (
          <div>
            <div className="flex items-center mb-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {
                  setShowForm(false);
                  setEditingPayment(null);
                }}
                className="mr-2"
              >
                <ArrowLeft size={24} />
              </Button>
              <h2 className="text-2xl font-bold">{editingPayment ? "Edit Payment" : "Add New Payment"}</h2>
            </div>
            
            <PaymentForm 
              onSubmit={handleSubmit} 
              initialData={editingPayment} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;
