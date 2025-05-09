
import React from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dashboard = () => {
  const salesData = [
    { name: "Jan", value: 4000 },
    { name: "Feb", value: 3000 },
    { name: "Mar", value: 2000 },
    { name: "Apr", value: 2780 },
    { name: "May", value: 1890 },
    { name: "Jun", value: 2390 },
  ];

  const inventoryData = [
    { name: "In Stock", value: 400 },
    { name: "Low Stock", value: 300 },
    { name: "Out of Stock", value: 100 },
  ];

  const COLORS = ["#0088FE", "#FFBB28", "#FF8042"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navigation title="Dashboard" pageType="dashboard" />
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-white shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹ 24,780</div>
              <p className="text-xs text-green-500">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Purchases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹ 18,230</div>
              <p className="text-xs text-red-500">-8% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Inventory Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹ 42,350</div>
              <p className="text-xs text-green-500">+5% from last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="bg-white shadow">
            <CardHeader>
              <CardTitle>Sales Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={salesData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#8884d8"
                      name="Sales"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow">
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={inventoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {inventoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white shadow">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Transaction</th>
                    <th className="px-6 py-3">Party</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b">
                    <td className="px-6 py-4">2023-05-08</td>
                    <td className="px-6 py-4">Purchase</td>
                    <td className="px-6 py-4">Supplier A</td>
                    <td className="px-6 py-4">₹ 5,000</td>
                    <td className="px-6 py-4"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Paid</span></td>
                  </tr>
                  <tr className="bg-gray-50 border-b">
                    <td className="px-6 py-4">2023-05-07</td>
                    <td className="px-6 py-4">Sale</td>
                    <td className="px-6 py-4">Customer B</td>
                    <td className="px-6 py-4">₹ 7,230</td>
                    <td className="px-6 py-4"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Pending</span></td>
                  </tr>
                  <tr className="bg-white border-b">
                    <td className="px-6 py-4">2023-05-05</td>
                    <td className="px-6 py-4">Purchase</td>
                    <td className="px-6 py-4">Supplier C</td>
                    <td className="px-6 py-4">₹ 3,450</td>
                    <td className="px-6 py-4"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Paid</span></td>
                  </tr>
                  <tr className="bg-gray-50 border-b">
                    <td className="px-6 py-4">2023-05-03</td>
                    <td className="px-6 py-4">Sale</td>
                    <td className="px-6 py-4">Customer D</td>
                    <td className="px-6 py-4">₹ 9,100</td>
                    <td className="px-6 py-4"><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Overdue</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
