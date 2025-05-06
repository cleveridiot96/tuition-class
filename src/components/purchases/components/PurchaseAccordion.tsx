
import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { PurchaseFormData } from "../types/PurchaseTypes";
import PurchaseFormHeader from "./PurchaseFormHeader";
import PurchaseDetails from "./PurchaseDetails";
import BrokerageDetails from "../BrokerageDetails";
import PurchaseSummary from "../PurchaseSummary";

interface PurchaseAccordionProps {
  form: UseFormReturn<any>;
  locations: string[];
  brokerageAmount: number;
  totalAmount: number;
  transportCost: number;
  expenses: number;
  totalAfterExpenses: number;
  ratePerKgAfterExpenses: number;
  partyManagement?: any;
}

const PurchaseAccordion: React.FC<PurchaseAccordionProps> = ({
  form,
  locations,
  brokerageAmount,
  totalAmount,
  transportCost,
  expenses,
  totalAfterExpenses,
  ratePerKgAfterExpenses,
  partyManagement,
}: PurchaseAccordionProps) => {
  return (
    <div className="space-y-8">
      <section className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium mb-4">Purchase Details</h2>
        <PurchaseFormHeader form={form} />
      </section>
      
      <section className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium mb-4">Bags & Rate</h2>
        <PurchaseDetails 
          form={form} 
          locations={locations} 
          partyManagement={partyManagement} 
        />
      </section>
      
      <section className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium mb-4">Brokerage Details</h2>
        <BrokerageDetails 
          form={form} 
          brokerageAmount={brokerageAmount} 
          totalAmount={totalAmount}
        />
      </section>
      
      <section className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium mb-4">Summary</h2>
        <PurchaseSummary 
          totalAmount={totalAmount}
          transportCost={transportCost}
          brokerageAmount={brokerageAmount}
          expenses={expenses}
          totalAfterExpenses={totalAfterExpenses}
          ratePerKgAfterExpenses={ratePerKgAfterExpenses}
        />
      </section>
    </div>
  );
};

export default PurchaseAccordion;
