
import React from 'react';
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Reports = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <Navigation title="Reports" showBackButton />
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-white shadow-md mb-6">
          <CardHeader>
            <CardTitle>Reports Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-600 mb-4">
              View and generate reports for your business data.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              <div className="p-4 border rounded-lg bg-blue-50 hover:bg-blue-100 cursor-pointer">
                <h3 className="font-medium text-blue-800">Sales Report</h3>
                <p className="text-sm text-gray-600">View detailed sales analysis</p>
              </div>
              
              <div className="p-4 border rounded-lg bg-green-50 hover:bg-green-100 cursor-pointer">
                <h3 className="font-medium text-green-800">Purchases Report</h3>
                <p className="text-sm text-gray-600">Analyze purchase transactions</p>
              </div>
              
              <div className="p-4 border rounded-lg bg-amber-50 hover:bg-amber-100 cursor-pointer">
                <h3 className="font-medium text-amber-800">Inventory Status</h3>
                <p className="text-sm text-gray-600">Check current inventory levels</p>
              </div>
              
              <div className="p-4 border rounded-lg bg-purple-50 hover:bg-purple-100 cursor-pointer">
                <h3 className="font-medium text-purple-800">Profit & Loss</h3>
                <p className="text-sm text-gray-600">Financial performance summary</p>
              </div>
              
              <div className="p-4 border rounded-lg bg-red-50 hover:bg-red-100 cursor-pointer">
                <h3 className="font-medium text-red-800">Cash Flow</h3>
                <p className="text-sm text-gray-600">Track cash inflows and outflows</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
