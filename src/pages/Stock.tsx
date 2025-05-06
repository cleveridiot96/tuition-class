
import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import StockReport from "@/components/StockReport";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInventory } from "@/services/storageService";

const Stock = () => {
  const [inventoryByLocation, setInventoryByLocation] = useState<Record<string, {bags: number, weight: number}>>({});
  
  useEffect(() => {
    // Load inventory and group by location
    const inventory = getInventory() || [];
    const activeInventory = (inventory || []).filter(item => !item.isDeleted && item.quantity > 0);
    
    const locationMap: Record<string, {bags: number, weight: number}> = {};
    
    activeInventory.forEach(item => {
      if (!item) return; // Skip if item is undefined or null
      
      const location = item.location || 'Unknown';
      if (!locationMap[location]) {
        locationMap[location] = { bags: 0, weight: 0 };
      }
      locationMap[location].bags += item.quantity || 0;
      // Estimate weight based on bags (assuming 50kg per bag if no weight specified)
      const estimatedWeight = item.netWeight || (item.quantity * 50);
      locationMap[location].weight += estimatedWeight;
    });
    
    setInventoryByLocation(locationMap);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <Navigation title="Stock Report" showBackButton />
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 gap-6">
          <StockReport />
          <Card className="mt-6 bg-gradient-to-br from-orange-100 to-orange-200 border-orange-200 shadow">
            <CardHeader>
              <CardTitle className="text-orange-800">Stock Summary by Location</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(inventoryByLocation).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(inventoryByLocation).map(([location, stats]) => (
                    <Card key={location} className="p-4 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100 border-orange-100">
                      <h3 className="font-semibold text-lg text-orange-800">{location}</h3>
                      <p className="text-orange-600">{stats.bags} bags</p>
                      <p className="text-orange-600">~{stats.weight.toFixed(2)} kgs</p>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-orange-500">No stock data available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Stock;
