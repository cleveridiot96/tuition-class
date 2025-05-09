
import React from "react";
import Navigation from "@/components/Navigation";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navigation title="Home" pageType="home" />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6 text-blue-800">Welcome to the Offline ERP System</h1>
        <p className="mb-4">
          Please select an option from the navigation menu to get started.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2 text-blue-700">Purchases</h2>
            <p className="text-gray-600">Manage your purchase transactions</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2 text-blue-700">Sales</h2>
            <p className="text-gray-600">Manage your sales transactions</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2 text-blue-700">Inventory</h2>
            <p className="text-gray-600">Track your inventory levels</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2 text-blue-700">Masters</h2>
            <p className="text-gray-600">Manage master data for your business</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2 text-blue-700">Reports</h2>
            <p className="text-gray-600">Generate business reports</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2 text-blue-700">Settings</h2>
            <p className="text-gray-600">Configure application settings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
