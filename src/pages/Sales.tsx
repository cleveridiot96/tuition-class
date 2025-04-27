
import React from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSales } from "@/services/storageService";

const Sales = () => {
  const [sales, setSales] = React.useState<any[]>([]);
  
  React.useEffect(() => {
    // Load sales data
    const salesData = getSales() || [];
    setSales(salesData);
    
    console.log("Sales page loaded, found", salesData.length, "sales records");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <Navigation title="Sales" showBackButton className="sticky top-0 z-10 bg-purple-700 text-white shadow-md" />
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-gradient-to-br from-purple-100 to-purple-200 border-purple-200 shadow">
          <CardHeader>
            <CardTitle className="text-purple-800">Sales</CardTitle>
          </CardHeader>
          <CardContent>
            {sales.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No sales recorded yet.</p>
            ) : (
              <div className="border rounded-md overflow-hidden bg-white">
                <p className="p-4">Found {sales.length} sales records.</p>
                {/* Sales data will be displayed here in future implementation */}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Sales;
