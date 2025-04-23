
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
    <Card className="h-full bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 flex flex-row items-center justify-between bg-gradient-to-r from-green-200 to-green-100 border-b border-green-200">
        <CardTitle className="text-lg font-semibold text-green-800">Sales Summary</CardTitle>
        <ShoppingCart className="h-5 w-5 text-green-600" />
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-green-700">Total Amount</p>
            <p className="text-2xl font-bold text-green-800">₹{amount.toLocaleString()}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-green-50 p-2 rounded-md">
              <p className="text-xs text-green-600">Bags</p>
              <p className="text-lg font-semibold text-green-700">{bags.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 p-2 rounded-md">
              <p className="text-xs text-green-600">Net Weight</p>
              <p className="text-lg font-semibold text-green-700">{kgs.toLocaleString()} kg</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesSummaryCard;
