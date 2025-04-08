
import React from "react";
import Navigation from "@/components/Navigation";
import StockReport from "@/components/StockReport";
import Calculator from "@/components/Calculator";

const Stock = () => {
  return (
    <div className="min-h-screen bg-ag-beige">
      <Navigation title="Stock Report" showBackButton />
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <StockReport />
          </div>
          <div>
            <Calculator />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stock;
