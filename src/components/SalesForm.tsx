
import React from "react";
import SalesFormContent from "./sales-form/SalesFormContent";
import { useSalesFormLogic } from "./sales-form/useSalesFormLogic";

// This component only handles the callback and manages separation of logic/content
interface SalesFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  onPrint?: () => void;
}

const SalesForm: React.FC<SalesFormProps> = ({ onSubmit, initialData, onPrint }) => {
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
    const subtotal = formData.quantity * formData.rate;
    const totalAmount = subtotal + formData.transportCost + formData.brokerageAmount;
    const billAmount = formData.billAmount !== null ? formData.billAmount : totalAmount;
    const salesData = {
      ...formData,
      id: initialData?.id || `sale-${Date.now()}`,
      totalAmount,
      billAmount,
      customer: customers.find((c) => c.id === formData.customerId)?.name,
      broker: brokers.find((b) => b.id === formData.brokerId)?.name,
      transporter: transporters.find((t) => t.id === formData.transporterId)?.name
    };
    onSubmit(salesData);
  };

  return (
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
  );
};

export default SalesForm;
