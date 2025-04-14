
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Printer, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getPurchases } from "@/services/storageService";

const PurchaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [purchase, setPurchase] = useState(null);
  
  useEffect(() => {
    if (id) {
      const purchases = getPurchases();
      const foundPurchase = purchases.find(p => p.id === id);
      
      if (foundPurchase) {
        setPurchase(foundPurchase);
      } else {
        toast({
          title: "Purchase Not Found",
          description: "The requested purchase record does not exist",
          variant: "destructive"
        });
        navigate('/purchases');
      }
    }
  }, [id, navigate, toast]);
  
  const handlePrint = () => {
    window.print();
  };

  const handleEdit = () => {
    // Navigation to edit form will be implemented later
    toast({
      title: "Edit Feature",
      description: "Edit functionality is coming soon",
    });
  };
  
  if (!purchase) {
    return (
      <div className="min-h-screen bg-ag-beige">
        <Navigation title="Purchase Detail" showBackButton />
        <div className="container mx-auto px-4 py-6">
          <Card>
            <CardContent className="flex items-center justify-center p-12">
              <p>Loading purchase details...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-ag-beige">
      <Navigation title="Purchase Detail" showBackButton />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/purchases')}
            className="flex items-center gap-1"
          >
            <ArrowLeft size={18} />
            Back to Purchases
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handlePrint}
              className="flex items-center gap-1"
            >
              <Printer size={18} />
              Print
            </Button>
            <Button 
              onClick={handleEdit}
              className="flex items-center gap-1"
            >
              <Edit size={18} />
              Edit
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Purchase #{purchase.lotNumber}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-bold text-lg">General Information</h3>
                <div className="grid grid-cols-2 gap-2">
                  <p className="font-semibold">Date:</p>
                  <p>{new Date(purchase.date).toLocaleDateString()}</p>
                  
                  <p className="font-semibold">Lot Number:</p>
                  <p>{purchase.lotNumber}</p>
                  
                  <p className="font-semibold">Product:</p>
                  <p>{purchase.productName}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Parties</h3>
                <div className="grid grid-cols-2 gap-2">
                  <p className="font-semibold">Agent:</p>
                  <p>{purchase.agentName}</p>
                  
                  <p className="font-semibold">Supplier:</p>
                  <p>{purchase.supplierName}</p>
                  
                  <p className="font-semibold">Transporter:</p>
                  <p>{purchase.transporterName}</p>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-bold text-lg mb-4">Financial Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid grid-cols-2 gap-2">
                  <p className="font-semibold">Quantity:</p>
                  <p>{purchase.quantity} bags</p>
                  
                  <p className="font-semibold">Rate:</p>
                  <p>₹{purchase.rate}/bag</p>
                  
                  <p className="font-semibold">Base Amount:</p>
                  <p>₹{purchase.baseAmount}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <p className="font-semibold">Transport Cost:</p>
                  <p>₹{purchase.transportCost}</p>
                  
                  <p className="font-semibold">Other Expenses:</p>
                  <p>₹{purchase.otherExpenses || 0}</p>
                  
                  <p className="font-semibold font-bold">Total Amount:</p>
                  <p className="font-bold">₹{purchase.totalAfterExpenses}</p>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-bold text-lg mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid grid-cols-2 gap-2">
                  <p className="font-semibold">Storage Location:</p>
                  <p>{purchase.location}</p>
                  
                  <p className="font-semibold">Vehicle Number:</p>
                  <p>{purchase.vehicleNumber}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <p className="font-semibold">Date Added:</p>
                  <p>{new Date(purchase.dateAdded || purchase.date).toLocaleDateString()}</p>
                  
                  <p className="font-semibold">Notes:</p>
                  <p>{purchase.notes || '-'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PurchaseDetail;
