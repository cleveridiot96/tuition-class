
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
    <div className="h-full relative overflow-hidden rounded-lg backdrop-blur-lg bg-green-400/10 border border-green-400/20 shadow-lg hover:shadow-green-400/10 transition-all duration-300">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-green-400">Sales Summary</CardTitle>
        <ShoppingCart className="h-5 w-5 text-green-400" />
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-green-300">Total Amount</p>
            <p className="text-2xl font-bold text-green-400">₹{amount.toLocaleString()}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-green-400/5 p-2 rounded-md border border-green-400/10">
              <p className="text-xs text-green-300">Bags</p>
              <p className="text-lg font-semibold text-green-400">{bags.toLocaleString()}</p>
            </div>
            <div className="bg-green-400/5 p-2 rounded-md border border-green-400/10">
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
