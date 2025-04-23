
import React from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Form } from "@/components/ui/form";
import PurchaseAccordion from "./components/PurchaseAccordion";
import PurchaseFormActions from "./components/PurchaseFormActions";
import DialogManager from "./components/DialogManager";

const PurchaseFormContent = ({
  form,
  onCancel,
  isSubmitting,
  isEdit,
  locations,
  brokerageAmount,
  totalAmount,
  transportCost,
  totalAfterExpenses,
  ratePerKgAfterExpenses,
  extractBagsFromLotNumber,
  showBrokerage,
  initialData,
  expenses,
  showDuplicateLotDialog,
  setShowDuplicateLotDialog,
  duplicateLotInfo,
  onContinueDespiteDuplicate,
  handleFormSubmit,
  partyManagement,
}: any) => (
  <Card className="bg-white border-blue-100 shadow-md overflow-hidden">
    <ScrollArea className="h-[calc(100vh-120px)]">
      <div className="p-6 max-w-2xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-blue-800">{isEdit ? 'Edit Purchase' : 'Add New Purchase'}</h2>
              <p className="text-gray-600 text-sm mt-1">Fill in the purchase details</p>
            </div>

            <PurchaseAccordion
              form={form}
              locations={locations}
              brokerageAmount={brokerageAmount}
              totalAmount={totalAmount}
              transportCost={transportCost}
              expenses={expenses}
              totalAfterExpenses={totalAfterExpenses}
              ratePerKgAfterExpenses={ratePerKgAfterExpenses}
              partyManagement={partyManagement}
            />

            <PurchaseFormActions
              onCancel={onCancel}
              isSubmitting={isSubmitting}
              isEdit={isEdit}
            />
          </form>
        </Form>
      </div>
    </ScrollArea>
    
    <DialogManager
      showDuplicateLotDialog={showDuplicateLotDialog}
      setShowDuplicateLotDialog={setShowDuplicateLotDialog}
      duplicateLotInfo={duplicateLotInfo}
      onContinueDespiteDuplicate={onContinueDespiteDuplicate}
      partyManagement={partyManagement}
    />
  </Card>
);

export default PurchaseFormContent;
