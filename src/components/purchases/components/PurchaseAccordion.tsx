import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PurchaseFormData } from "../types/PurchaseTypes";
import PurchaseFormHeader from "./PurchaseFormHeader";
import PurchaseDetails from "./PurchaseDetails";
import BrokerageDetails from "../BrokerageDetails";
import PurchaseSummary from "../PurchaseSummary";

interface PurchaseAccordionProps {
  form: any;
  locations: string[];
  brokerageAmount: number;
  totalAmount: number;
  transportCost: number;
  expenses: number;
  totalAfterExpenses: number;
  ratePerKgAfterExpenses: number;
  partyManagement?: any;
}

const PurchaseAccordion = ({
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
    <Tabs defaultValue="header">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="header">Purchase Details</TabsTrigger>
        <TabsTrigger value="details">Bags & Rate</TabsTrigger>
        <TabsTrigger value="brokerage">Brokerage Details</TabsTrigger>
        <TabsTrigger value="summary">Summary</TabsTrigger>
      </TabsList>
      
      <TabsContent value="header">
        <PurchaseFormHeader form={form} />
      </TabsContent>
      
      <TabsContent value="details">
        <PurchaseDetails form={form} locations={locations} />
      </TabsContent>
      
      <TabsContent value="brokerage">
        <BrokerageDetails 
          form={form} 
          brokerageAmount={brokerageAmount} 
          totalAmount={totalAmount}
        />
      </TabsContent>
      
      <TabsContent value="summary">
        <PurchaseSummary 
          totalAmount={totalAmount}
          transportCost={transportCost}
          brokerageAmount={brokerageAmount}
          expenses={expenses}
          totalAfterExpenses={totalAfterExpenses}
          ratePerKgAfterExpenses={ratePerKgAfterExpenses}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PurchaseAccordion;
