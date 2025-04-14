
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Printer, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getSales } from "@/services/storageService";

const SaleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sale, setSale] = useState(null);
  
  useEffect(() => {
    if (id) {
      const sales = getSales();
      const foundSale = sales.find(s => s.id === id);
      
      if (foundSale) {
        setSale(foundSale);
      } else {
        toast({
          title: "Sale Not Found",
          description: "The requested sale record does not exist",
          variant: "destructive"
        });
        navigate('/sales');
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
  
  if (!sale) {
    return (
      <div className="min-h-screen bg-ag-beige">
        <Navigation title="Sale Detail" showBackButton />
        <div className="container mx-auto px-4 py-6">
          <Card>
            <CardContent className="flex items-center justify-center p-12">
              <p>Loading sale details...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-ag-beige">
      <Navigation title="Sale Detail" showBackButton />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/sales')}
            className="flex items-center gap-1"
          >
            <ArrowLeft size={18} />
            Back to Sales
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
            <CardTitle>Sale #{sale.lotNumber}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-bold text-lg">General Information</h3>
                <div className="grid grid-cols-2 gap-2">
                  <p className="font-semibold">Date:</p>
                  <p>{new Date(sale.date).toLocaleDateString()}</p>
                  
                  <p className="font-semibold">Lot Number:</p>
                  <p>{sale.lotNumber}</p>
                  
                  <p className="font-semibold">Product:</p>
                  <p>{sale.productName}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Parties</h3>
                <div className="grid grid-cols-2 gap-2">
                  <p className="font-semibold">Customer:</p>
                  <p>{sale.customerName}</p>
                  
                  <p className="font-semibold">Broker:</p>
                  <p>{sale.brokerName || '-'}</p>
                  
                  <p className="font-semibold">Transporter:</p>
                  <p>{sale.transporterName || '-'}</p>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-bold text-lg mb-4">Financial Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid grid-cols-2 gap-2">
                  <p className="font-semibold">Quantity:</p>
                  <p>{sale.quantity} bags</p>
                  
                  <p className="font-semibold">Rate:</p>
                  <p>₹{sale.rate}/bag</p>
                  
                  <p className="font-semibold">Base Amount:</p>
                  <p>₹{sale.baseAmount}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <p className="font-semibold">Transport Cost:</p>
                  <p>₹{sale.transportCost || 0}</p>
                  
                  <p className="font-semibold">Broker Commission:</p>
                  <p>₹{sale.brokerCommission || 0}</p>
                  
                  <p className="font-semibold font-bold">Total Amount:</p>
                  <p className="font-bold">₹{sale.totalAmount}</p>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-bold text-lg mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid grid-cols-2 gap-2">
                  <p className="font-semibold">Source Location:</p>
                  <p>{sale.sourceLocation}</p>
                  
                  <p className="font-semibold">Vehicle Number:</p>
                  <p>{sale.vehicleNumber || '-'}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <p className="font-semibold">Date Added:</p>
                  <p>{new Date(sale.dateAdded || sale.date).toLocaleDateString()}</p>
                  
                  <p className="font-semibold">Notes:</p>
                  <p>{sale.notes || '-'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SaleDetail;
