
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from 'lucide-react';

interface SalesSummaryCardProps {
  amount: number;
  bags: number;
  kgs: number;
}

const SalesSummaryCard: React.FC<SalesSummaryCardProps> = ({
  amount,
  bags,
  kgs
}) => {
  return (
    <div className="h-full relative overflow-hidden rounded-lg bg-gradient-to-br from-green-400/20 via-emerald-400/20 to-teal-400/20 backdrop-blur-xl border border-green-400/30 shadow-lg hover:shadow-green-400/20 transition-all duration-500 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-400/10 animate-pulse"></div>
      <CardHeader className="pb-2 flex flex-row items-center justify-between relative z-10">
        <CardTitle className="text-lg font-semibold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Sales Summary</CardTitle>
        <ShoppingCart className="h-5 w-5 text-green-400" />
      </CardHeader>
      <CardContent className="pt-4 relative z-10">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-green-300">Total Amount</p>
            <p className="text-2xl font-bold text-green-400">₹{amount.toLocaleString()}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-green-400/5 p-2 rounded-md border border-green-400/10 hover:bg-green-400/10 transition-colors">
              <p className="text-xs text-green-300">Bags</p>
              <p className="text-lg font-semibold text-green-400">{bags.toLocaleString()}</p>
            </div>
            <div className="bg-green-400/5 p-2 rounded-md border border-green-400/10 hover:bg-green-400/10 transition-colors">
              <p className="text-xs text-green-300">Net Weight</p>
              <p className="text-lg font-semibold text-green-400">{kgs.toLocaleString()} kg</p>
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default SalesSummaryCard;
