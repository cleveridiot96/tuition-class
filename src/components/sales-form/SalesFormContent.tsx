
import React from "react";
import { Form } from "@/components/ui/form";
import SalesFormFields from "./SalesFormFields";
import SalesFormSummary from "./SalesFormSummary";
import SalesFormActions from "./SalesFormActions";

const SalesFormContent = ({
  form,
  inventory,
  customers,
  brokers,
  transporters,
  maxQuantity,
  isCutBill,
  initialData,
  selectedLot,
  selectedBroker,
  handleLotChange,
  handleBrokerChange,
  handleBillAmountToggle,
  onPrint,
  isSubmitting,
  handleFormSubmit,
}) => (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
      <SalesFormFields
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
        setIsCutBill={handleBillAmountToggle}
      />
      <div className="flex justify-between">
        <SalesFormSummary
          subtotal={form.watch("quantity") * form.watch("rate")}
          transportCost={form.watch("transportCost")}
          brokerageAmount={form.watch("brokerageAmount")}
          isCutBill={isCutBill}
          billAmount={form.watch("billAmount")}
        />
        <SalesFormActions
          initialData={initialData}
          onPrint={onPrint}
          isSubmitting={isSubmitting}
        />
      </div>
    </form>
  </Form>
);

export default SalesFormContent;
