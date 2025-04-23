
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
    <div className="h-full relative overflow-hidden rounded-lg bg-gradient-to-br from-emerald-400/20 via-green-400/20 to-teal-400/20 backdrop-blur-xl border border-emerald-400/30 shadow-lg hover:shadow-emerald-400/20 transition-all duration-500 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 animate-pulse"></div>
      <CardHeader className="pb-2 flex flex-row items-center justify-between relative z-10">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Sales Summary</CardTitle>
        <ShoppingCart className="h-6 w-6 text-emerald-400" />
      </CardHeader>
      <CardContent className="pt-4 relative z-10">
        <div className="space-y-4">
          <div>
            <p className="text-base text-emerald-300 font-medium">Total Amount</p>
            <p className="text-3xl font-bold text-emerald-400">₹{amount.toLocaleString()}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-400/5 p-3 rounded-md border border-emerald-400/10 hover:bg-emerald-400/10 transition-colors">
              <p className="text-sm text-emerald-300 font-medium">Bags</p>
              <p className="text-xl font-bold text-emerald-400">{bags.toLocaleString()}</p>
            </div>
            <div className="bg-emerald-400/5 p-3 rounded-md border border-emerald-400/10 hover:bg-emerald-400/10 transition-colors">
              <p className="text-sm text-emerald-300 font-medium">Net Weight</p>
              <p className="text-xl font-bold text-emerald-400">{kgs.toLocaleString()} kg</p>
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default SalesSummaryCard;
