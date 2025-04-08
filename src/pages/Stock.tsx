
import React from "react";
import Navigation from "@/components/Navigation";
import StockReport from "@/components/StockReport";

const Stock = () => {
  return (
    <div className="min-h-screen bg-ag-beige">
      <Navigation title="Stock Report" showBackButton />
      <div className="container mx-auto px-4 py-6">
        <StockReport />
      </div>
    </div>
  );
};

export default Stock;
