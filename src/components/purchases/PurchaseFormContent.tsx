
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
}: any) => (
  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 shadow-md overflow-hidden">
    <ScrollArea className="h-[calc(100vh-200px)] pr-4">
      <div className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <PurchaseAccordion
              form={form}
              locations={locations}
              brokerageAmount={brokerageAmount}
              totalAmount={totalAmount}
              transportCost={transportCost}
              expenses={expenses}
              totalAfterExpenses={totalAfterExpenses}
              ratePerKgAfterExpenses={ratePerKgAfterExpenses}
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
    />
  </Card>
);

export default PurchaseFormContent;
