
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
  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 shadow-md overflow-hidden">
    <ScrollArea className="h-[calc(100vh-200px)] md:h-auto pr-4">
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
      showAddPartyDialog={partyManagement?.showAddPartyDialog}
      setShowAddPartyDialog={partyManagement?.setShowAddPartyDialog}
      newPartyName={partyManagement?.newPartyName}
      setNewPartyName={partyManagement?.setNewPartyName}
      newPartyAddress={partyManagement?.newPartyAddress}
      setNewPartyAddress={partyManagement?.setNewPartyAddress}
      handleAddNewParty={partyManagement?.handleAddNewParty}
      showSimilarPartyDialog={partyManagement?.showSimilarPartyDialog}
      setShowSimilarPartyDialog={partyManagement?.setShowSimilarPartyDialog}
      similarParty={partyManagement?.similarParty}
      useSuggestedParty={partyManagement?.useSuggestedParty}
      showAddTransporterDialog={partyManagement?.showAddTransporterDialog}
      setShowAddTransporterDialog={partyManagement?.setShowAddTransporterDialog}
      newTransporterName={partyManagement?.newTransporterName}
      setNewTransporterName={partyManagement?.setNewTransporterName}
      newTransporterAddress={partyManagement?.newTransporterAddress}
      setNewTransporterAddress={partyManagement?.setNewTransporterAddress}
      handleAddNewTransporter={partyManagement?.handleAddNewTransporter}
      showAddBrokerDialog={partyManagement?.showAddBrokerDialog}
      setShowAddBrokerDialog={partyManagement?.setShowAddBrokerDialog}
      newBrokerName={partyManagement?.newBrokerName}
      setNewBrokerName={partyManagement?.setNewBrokerName}
      newBrokerAddress={partyManagement?.newBrokerAddress}
      setNewBrokerAddress={partyManagement?.setNewBrokerAddress}
      newBrokerRate={partyManagement?.newBrokerRate}
      setNewBrokerRate={partyManagement?.setNewBrokerRate}
      handleAddNewBroker={partyManagement?.handleAddNewBroker}
    />
  </Card>
);

export default PurchaseFormContent;
