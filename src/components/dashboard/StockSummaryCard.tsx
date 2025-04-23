
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
    <div className="h-full relative overflow-hidden rounded-lg bg-gradient-to-br from-amber-400/20 via-orange-400/20 to-yellow-400/20 backdrop-blur-xl border border-amber-400/30 shadow-lg hover:shadow-amber-400/20 transition-all duration-500 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-orange-400/10 animate-pulse"></div>
      <CardHeader className="pb-2 flex flex-row items-center justify-between relative z-10">
        <CardTitle className="text-lg font-semibold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Stock Summary</CardTitle>
        <Package className="h-5 w-5 text-amber-400" />
      </CardHeader>
      <CardContent className="pt-4 relative z-10">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-amber-300">Total Bags</p>
            <p className="text-2xl font-bold text-amber-400">{totalBags.toLocaleString()}</p>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <div className="bg-amber-400/5 p-1.5 rounded-md border border-amber-400/10 hover:bg-amber-400/10 transition-colors">
              <p className="text-xs text-amber-300">Mumbai</p>
              <p className="text-sm font-semibold text-amber-400">{mumbai}</p>
            </div>
            <div className="bg-amber-400/5 p-1.5 rounded-md border border-amber-400/10 hover:bg-amber-400/10 transition-colors">
              <p className="text-xs text-amber-300">Chiplun</p>
              <p className="text-sm font-semibold text-amber-400">{chiplun}</p>
            </div>
            <div className="bg-amber-400/5 p-1.5 rounded-md border border-amber-400/10 hover:bg-amber-400/10 transition-colors">
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
