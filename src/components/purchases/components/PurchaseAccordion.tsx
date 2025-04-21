
import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PurchaseFormData } from "../PurchaseFormSchema";
import PurchaseFormHeader from "./PurchaseFormHeader";
import PurchaseDetails from "./PurchaseDetails";
import BrokerageDetails from "../BrokerageDetails";
import PurchaseSummary from "../PurchaseSummary";

interface PurchaseAccordionProps {
  form: UseFormReturn<PurchaseFormData>;
  locations: string[];
  brokerageAmount: number;
  totalAmount: number;
  transportCost: number;
  expenses: number;
  totalAfterExpenses: number;
  ratePerKgAfterExpenses: number;
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
}) => {
  return (
    <Accordion type="single" collapsible defaultValue="header">
      <AccordionItem value="header" className="border-none">
        <AccordionTrigger className="py-2 text-blue-700 hover:text-blue-900 font-medium">
          Purchase Details
        </AccordionTrigger>
        <AccordionContent>
          <PurchaseFormHeader form={form} />
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="details" className="border-none">
        <AccordionTrigger className="py-2 text-blue-700 hover:text-blue-900 font-medium">
          Bags & Rate
        </AccordionTrigger>
        <AccordionContent>
          <PurchaseDetails form={form} locations={locations} />
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="brokerage" className="border-none">
        <AccordionTrigger className="py-2 text-blue-700 hover:text-blue-900 font-medium">
          Brokerage Details
        </AccordionTrigger>
        <AccordionContent>
          <BrokerageDetails 
            form={form} 
            brokerageAmount={brokerageAmount} 
            totalAmount={totalAmount}
          />
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="summary" className="border-none">
        <AccordionTrigger className="py-2 text-blue-700 hover:text-blue-900 font-medium">
          Summary
        </AccordionTrigger>
        <AccordionContent>
          <PurchaseSummary 
            totalAmount={totalAmount}
            transportCost={transportCost}
            brokerageAmount={brokerageAmount}
            expenses={expenses}
            totalAfterExpenses={totalAfterExpenses}
            ratePerKgAfterExpenses={ratePerKgAfterExpenses}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default PurchaseAccordion;
