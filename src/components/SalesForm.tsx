
import React, { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import SalesFormContent from "./sales-form/SalesFormContent";
import { useSalesFormLogic } from "./sales-form/useSalesFormLogic";
import { toast } from "sonner";
import { safeNumber } from "@/lib/utils";

// This component only handles the callback and manages separation of logic/content
interface SalesFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  onPrint?: () => void;
}

const SalesFormInner: React.FC<SalesFormProps> = ({ onSubmit, initialData, onPrint }) => {
  const {
    form,
    inventory,
    customers,
    brokers,
    transporters,
    selectedLot,
    selectedBroker,
    maxQuantity,
    isCutBill,
    handleLotChange,
    handleBrokerChange,
    handleBillAmountToggle,
  } = useSalesFormLogic(initialData);

  const isSubmitting = form.formState.isSubmitting;

  // Submission is delegated here, then calls parent with data:
  const handleFormSubmit = (formData: any) => {
    try {
      // Safely convert all values to numbers to prevent NaN errors
      const quantity = safeNumber(formData.quantity);
      const rate = safeNumber(formData.rate);
      const transportCost = safeNumber(formData.transportCost, 0);
      const brokerageAmount = safeNumber(formData.brokerageAmount, 0);
      
      const subtotal = quantity * rate;
      const totalAmount = subtotal + transportCost + brokerageAmount;
      const billAmount = formData.billAmount !== null ? safeNumber(formData.billAmount) : totalAmount;
      
      const salesData = {
        ...formData,
        // Ensure all numeric fields are proper numbers
        quantity: quantity,
        rate: rate,
        netWeight: safeNumber(formData.netWeight),
        transportCost: transportCost,
        brokerageAmount: brokerageAmount,
        totalAmount: totalAmount,
        billAmount: billAmount,
        // Add required fields
        id: initialData?.id || `sale-${Date.now()}`,
        customer: customers.find((c) => c.id === formData.customerId)?.name || "Unknown Customer",
        broker: brokers.find((b) => b.id === formData.brokerId)?.name || null,
        transporter: transporters.find((t) => t.id === formData.transporterId)?.name || null,
        salesBroker: brokers.find((b) => b.id === formData.brokerId)?.name || null
      };
      
      toast.success(initialData ? "Sale updated successfully" : "Sale added successfully");
      onSubmit(salesData);
    } catch (error) {
      console.error("Error processing form data:", error);
      toast.error("Error processing sale data. Please check your inputs.");
    }
  };

  return (
    <Card className="bg-white border-green-100 shadow-md overflow-hidden">
      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="p-6 max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-green-800">{initialData ? 'Edit Sale' : 'Add New Sale'}</h2>
            <p className="text-gray-600 text-sm mt-1">Fill in the sale details</p>
          </div>
          
          <SalesFormContent
            form={form}
            inventory={inventory}
            customers={customers}
            brokers={brokers}
            transporters={transporters}
            maxQuantity={maxQuantity}
            isCutBill={isCutBill}
            initialData={initialData}
            selectedLot={selectedLot}
            selectedBroker={selectedBroker}
            handleLotChange={handleLotChange}
            handleBrokerChange={handleBrokerChange}
            handleBillAmountToggle={handleBillAmountToggle}
            onPrint={onPrint}
            isSubmitting={isSubmitting}
            handleFormSubmit={handleFormSubmit}
          />
        </div>
      </ScrollArea>
    </Card>
  );
};

// Wrap the form with an error boundary
const SalesForm: React.FC<SalesFormProps> = (props) => {
  return (
    <ErrorBoundary 
      fallback={
        <div className="p-6 bg-white rounded-lg border border-red-200">
          <h3 className="text-lg font-medium text-red-600">Something went wrong</h3>
          <p className="mt-2 text-gray-600">There was an error loading the sales form. Please try again.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Reload
          </button>
        </div>
      }
    >
      <SalesFormInner {...props} />
    </ErrorBoundary>
  );
};

export default SalesForm;
