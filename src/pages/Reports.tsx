
import React from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Reports = () => {
  const data = [
    { name: "Jan", purchases: 4000, sales: 2400 },
    { name: "Feb", purchases: 3000, sales: 1398 },
    { name: "Mar", purchases: 2000, sales: 9800 },
    { name: "Apr", purchases: 2780, sales: 3908 },
    { name: "May", purchases: 1890, sales: 4800 },
    { name: "Jun", purchases: 2390, sales: 3800 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      <Navigation title="Reports" showBackButton pageType="reports" />
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-white border-amber-200 shadow mb-6">
          <CardHeader>
            <CardTitle className="text-amber-800">Sales vs Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="purchases" fill="#8884d8" name="Purchases" />
                  <Bar dataKey="sales" fill="#82ca9d" name="Sales" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white border-amber-200 shadow">
            <CardHeader>
              <CardTitle className="text-amber-800">Report Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">Sales Report</Button>
              <Button variant="outline" className="w-full justify-start">Purchase Report</Button>
              <Button variant="outline" className="w-full justify-start">Inventory Report</Button>
              <Button variant="outline" className="w-full justify-start">Profit & Loss Report</Button>
              <Button variant="outline" className="w-full justify-start">Cash Flow Report</Button>
              <Button variant="outline" className="w-full justify-start">Customer Ledger</Button>
              <Button variant="outline" className="w-full justify-start">Supplier Ledger</Button>
            </CardContent>
          </Card>

          <Card className="bg-white border-amber-200 shadow">
            <CardHeader>
              <CardTitle className="text-amber-800">Report Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Date Range</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm mb-1">Start Date</p>
                    <input 
                      type="date" 
                      className="w-full border rounded px-2 py-1" 
                    />
                  </div>
                  <div>
                    <p className="text-sm mb-1">End Date</p>
                    <input 
                      type="date" 
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Export Options</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">PDF</Button>
                  <Button variant="outline" size="sm">Excel</Button>
                  <Button variant="outline" size="sm">CSV</Button>
                </div>
              </div>
              
              <Button className="w-full">Generate Report</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;
