
import React from "react";
import { FormRow } from "@/components/ui/form";
import WeightDetails from "./WeightDetails";
import RateDetails from "./RateDetails";
import LocationSelector from "./LocationSelector";
import PartySelector from "./PartySelector";
import BrokerSelector from "./BrokerSelector";
import { PurchaseDetailsProps } from "../types/PurchaseTypes";

interface ExtendedPurchaseDetailsProps extends PurchaseDetailsProps {
  partyManagement: any;
}

const PurchaseDetails: React.FC<ExtendedPurchaseDetailsProps> = ({ form, locations, partyManagement }) => {
  return (
    <FormRow columns={2}>
      <PartySelector form={form} partyManagement={partyManagement} />
      <BrokerSelector form={form} partyManagement={partyManagement} />
      <WeightDetails form={form} />
      <RateDetails form={form} />
      <LocationSelector form={form} locations={locations} />
    </FormRow>
  );
};

export default PurchaseDetails;
