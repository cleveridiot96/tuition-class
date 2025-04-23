
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
    <div className="h-full relative overflow-hidden rounded-lg backdrop-blur-lg bg-blue-400/10 border border-blue-400/20 shadow-lg hover:shadow-blue-400/10 transition-all duration-300">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-blue-400">Purchase Summary</CardTitle>
        <BaggageClaim className="h-5 w-5 text-blue-400" />
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-blue-300">Total Amount</p>
            <p className="text-2xl font-bold text-blue-400">₹{amount.toLocaleString()}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-400/5 p-2 rounded-md border border-blue-400/10">
              <p className="text-xs text-blue-300">Bags</p>
              <p className="text-lg font-semibold text-blue-400">{bags.toLocaleString()}</p>
            </div>
            <div className="bg-blue-400/5 p-2 rounded-md border border-blue-400/10">
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
