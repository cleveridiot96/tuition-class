
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from 'lucide-react';

interface StockSummaryCardProps {
  mumbai: number;
  chiplun: number;
  sawantwadi: number;
}

const StockSummaryCard: React.FC<StockSummaryCardProps> = ({
  mumbai,
  chiplun,
  sawantwadi
}) => {
  const totalBags = mumbai + chiplun + sawantwadi;
  
  return (
    <Card className="h-full bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 flex flex-row items-center justify-between bg-gradient-to-r from-amber-200 to-amber-100 border-b border-amber-200">
        <CardTitle className="text-lg font-semibold text-amber-800">Stock</CardTitle>
        <Package className="h-5 w-5 text-amber-600" />
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-amber-700">Total Bags</p>
            <p className="text-2xl font-bold text-amber-800">{totalBags.toLocaleString()}</p>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <div className="bg-amber-50 p-1.5 rounded-md">
              <p className="text-xs text-amber-600">Mumbai</p>
              <p className="text-sm font-semibold text-amber-700">{mumbai}</p>
            </div>
            <div className="bg-amber-50 p-1.5 rounded-md">
              <p className="text-xs text-amber-600">Chiplun</p>
              <p className="text-sm font-semibold text-amber-700">{chiplun}</p>
            </div>
            <div className="bg-amber-50 p-1.5 rounded-md">
              <p className="text-xs text-amber-600">Sawantwadi</p>
              <p className="text-sm font-semibold text-amber-700">{sawantwadi}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockSummaryCard;
