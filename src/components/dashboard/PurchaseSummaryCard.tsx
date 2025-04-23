
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BaggageClaim } from 'lucide-react';

interface PurchaseSummaryCardProps {
  amount: number;
  bags: number;
  kgs: number;
}

const PurchaseSummaryCard: React.FC<PurchaseSummaryCardProps> = ({
  amount,
  bags,
  kgs
}) => {
  return (
    <div className="h-full relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-400/20 via-indigo-400/20 to-violet-400/20 backdrop-blur-xl border border-blue-400/30 shadow-lg hover:shadow-blue-400/20 transition-all duration-500 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 animate-pulse"></div>
      <CardHeader className="pb-2 flex flex-row items-center justify-between relative z-10">
        <CardTitle className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Purchase Summary</CardTitle>
        <BaggageClaim className="h-5 w-5 text-blue-400" />
      </CardHeader>
      <CardContent className="pt-4 relative z-10">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-blue-300">Total Amount</p>
            <p className="text-2xl font-bold text-blue-400">₹{amount.toLocaleString()}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-400/5 p-2 rounded-md border border-blue-400/10 hover:bg-blue-400/10 transition-colors">
              <p className="text-xs text-blue-300">Bags</p>
              <p className="text-lg font-semibold text-blue-400">{bags.toLocaleString()}</p>
            </div>
            <div className="bg-blue-400/5 p-2 rounded-md border border-blue-400/10 hover:bg-blue-400/10 transition-colors">
              <p className="text-xs text-blue-300">Net Weight</p>
              <p className="text-lg font-semibold text-blue-400">{kgs.toLocaleString()} kg</p>
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default PurchaseSummaryCard;
