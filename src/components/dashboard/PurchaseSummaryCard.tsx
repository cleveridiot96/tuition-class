
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
    <div className="h-full relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-400/20 via-violet-400/20 to-indigo-400/20 backdrop-blur-xl border border-purple-400/30 shadow-lg hover:shadow-purple-400/20 transition-all duration-500 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-indigo-400/10 animate-pulse"></div>
      <CardHeader className="pb-2 flex flex-row items-center justify-between relative z-10">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">Purchase Summary</CardTitle>
        <BaggageClaim className="h-6 w-6 text-purple-400" />
      </CardHeader>
      <CardContent className="pt-4 relative z-10">
        <div className="space-y-4">
          <div>
            <p className="text-base text-purple-300 font-medium">Total Amount</p>
            <p className="text-3xl font-bold text-purple-400">₹{amount.toLocaleString()}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-purple-400/5 p-3 rounded-md border border-purple-400/10 hover:bg-purple-400/10 transition-colors">
              <p className="text-sm text-purple-300 font-medium">Bags</p>
              <p className="text-xl font-bold text-purple-400">{bags.toLocaleString()}</p>
            </div>
            <div className="bg-purple-400/5 p-3 rounded-md border border-purple-400/10 hover:bg-purple-400/10 transition-colors">
              <p className="text-sm text-purple-300 font-medium">Net Weight</p>
              <p className="text-xl font-bold text-purple-400">{kgs.toLocaleString()} kg</p>
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default PurchaseSummaryCard;
