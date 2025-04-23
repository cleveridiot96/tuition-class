
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
    <div className="h-full relative overflow-hidden rounded-lg bg-gradient-to-br from-rose-400/20 via-pink-400/20 to-red-400/20 backdrop-blur-xl border border-rose-400/30 shadow-lg hover:shadow-rose-400/20 transition-all duration-500 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-rose-400/10 to-red-400/10 animate-pulse"></div>
      <CardHeader className="pb-2 flex flex-row items-center justify-between relative z-10">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-rose-400 to-red-500 bg-clip-text text-transparent">Stock Summary</CardTitle>
        <Package className="h-6 w-6 text-rose-400" />
      </CardHeader>
      <CardContent className="pt-4 relative z-10">
        <div className="space-y-4">
          <div>
            <p className="text-base text-rose-300 font-medium">Total Bags</p>
            <p className="text-3xl font-bold text-rose-400">{totalBags.toLocaleString()}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-rose-400/5 p-2 rounded-md border border-rose-400/10 hover:bg-rose-400/10 transition-colors">
              <p className="text-sm text-rose-300 font-medium">Mumbai</p>
              <p className="text-lg font-bold text-rose-400">{mumbai}</p>
            </div>
            <div className="bg-rose-400/5 p-2 rounded-md border border-rose-400/10 hover:bg-rose-400/10 transition-colors">
              <p className="text-sm text-rose-300 font-medium">Chiplun</p>
              <p className="text-lg font-bold text-rose-400">{chiplun}</p>
            </div>
            <div className="bg-rose-400/5 p-2 rounded-md border border-rose-400/10 hover:bg-rose-400/10 transition-colors">
              <p className="text-sm text-rose-300 font-medium">Sawantwadi</p>
              <p className="text-lg font-bold text-rose-400">{sawantwadi}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default StockSummaryCard;
