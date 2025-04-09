
import React from "react";
import Navigation from "@/components/Navigation";

const CalculatorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-ag-beige">
      <Navigation title="Calculator" />
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Calculator</h2>
            <p>This feature has been removed as requested.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;
