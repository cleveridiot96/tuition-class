
import React from "react";
import Navigation from "@/components/Navigation";
import Calculator from "@/components/Calculator";

const CalculatorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-ag-beige">
      <Navigation title="Calculator" />
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto">
          <Calculator />
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;
