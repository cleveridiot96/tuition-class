
import React from "react";
import Navigation from "@/components/Navigation";
import TransferForm from "./TransferForm";

const LocationTransferPage: React.FC = () => (
  <div className="min-h-screen bg-gray-50">
    <Navigation title="Location Transfer" showBackButton />
    <div className="container mx-auto py-8 px-4">
      <TransferForm />
    </div>
  </div>
);

export default LocationTransferPage;
