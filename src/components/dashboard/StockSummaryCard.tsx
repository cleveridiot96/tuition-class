
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
    <div className="h-full relative overflow-hidden rounded-lg backdrop-blur-lg bg-amber-400/10 border border-amber-400/20 shadow-lg hover:shadow-amber-400/10 transition-all duration-300">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-amber-400">Stock Summary</CardTitle>
        <Package className="h-5 w-5 text-amber-400" />
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-amber-300">Total Bags</p>
            <p className="text-2xl font-bold text-amber-400">{totalBags.toLocaleString()}</p>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <div className="bg-amber-400/5 p-1.5 rounded-md border border-amber-400/10">
              <p className="text-xs text-amber-300">Mumbai</p>
              <p className="text-sm font-semibold text-amber-400">{mumbai}</p>
            </div>
            <div className="bg-amber-400/5 p-1.5 rounded-md border border-amber-400/10">
              <p className="text-xs text-amber-300">Chiplun</p>
              <p className="text-sm font-semibold text-amber-400">{chiplun}</p>
            </div>
            <div className="bg-amber-400/5 p-1.5 rounded-md border border-amber-400/10">
              <p className="text-xs text-amber-300">Sawantwadi</p>
              <p className="text-sm font-semibold text-amber-400">{sawantwadi}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default StockSummaryCard;
