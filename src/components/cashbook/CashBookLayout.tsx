
import React from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CashBookHeader from "./CashBookHeader";
import CashBookContent from "./CashBookContent";
import PrintStyles from "./PrintStyles";

// Define props for the components
interface CashBookLayoutProps {
  // Add any props if needed in the future
}

const CashBookLayout: React.FC<CashBookLayoutProps> = () => {
  return (
    <div className="min-h-screen bg-ag-beige">
      <Navigation title="Cash Book" showBackButton />
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader className="border-b">
            <CashBookHeader />
          </CardHeader>
          <CardContent className="p-6">
            <CashBookContent />
          </CardContent>
        </Card>
      </div>
      <PrintStyles />
    </div>
  );
};

export default CashBookLayout;
