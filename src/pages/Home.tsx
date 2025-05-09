
import React from 'react';
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navigation title="Home" />
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-white shadow-md">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to किसान खाता सहायक</h2>
            <p className="text-gray-600">
              This is your accounting and inventory management system. Navigate using the menu to access different features.
            </p>
            <div className="mt-6">
              <p className="text-gray-600">
                Quick access:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <a href="#/dashboard" className="bg-blue-100 hover:bg-blue-200 transition-colors p-4 rounded-lg text-center">
                  Dashboard
                </a>
                <a href="#/master" className="bg-green-100 hover:bg-green-200 transition-colors p-4 rounded-lg text-center">
                  Master Data
                </a>
                <a href="#/inventory" className="bg-amber-100 hover:bg-amber-200 transition-colors p-4 rounded-lg text-center">
                  Inventory
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
