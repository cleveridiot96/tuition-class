
import React from "react";
import Navigation from "@/components/Navigation";
import DashboardMenu from "@/components/DashboardMenu";

const Index = () => {
  return (
    <div className="min-h-screen bg-ag-beige">
      <Navigation />
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-ag-brown-dark">
            किसान खाता सहायक
          </h2>
          <p className="text-lg text-ag-brown mt-2">
            आपका कृषि व्यापार प्रबंधन सॉफ्टवेयर
          </p>
        </div>
        <DashboardMenu />
      </div>
    </div>
  );
};

export default Index;
