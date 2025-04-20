
import React from "react";
import { FormRow } from "@/components/ui/form";
import WeightDetails from "./WeightDetails";
import RateDetails from "./RateDetails";
import LocationSelector from "./LocationSelector";
import { PurchaseDetailsProps } from "../types/PurchaseTypes";

const PurchaseDetails: React.FC<PurchaseDetailsProps> = ({ form, locations }) => {
  return (
    <FormRow columns={2}>
      <WeightDetails form={form} />
      <RateDetails form={form} />
      <LocationSelector form={form} locations={locations} />
    </FormRow>
  );
};

export default PurchaseDetails;
