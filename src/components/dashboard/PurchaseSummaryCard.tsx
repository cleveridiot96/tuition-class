
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { baggage-claim } from 'lucide-react';

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
    <Card className="h-full bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 flex flex-row items-center justify-between bg-gradient-to-r from-blue-200 to-blue-100 border-b border-blue-200">
        <CardTitle className="text-lg font-semibold text-blue-800">Purchase Summary</CardTitle>
        <baggage-claim className="h-5 w-5 text-blue-600" />
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-blue-700">Total Amount</p>
            <p className="text-2xl font-bold text-blue-800">₹{amount.toLocaleString()}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-50 p-2 rounded-md">
              <p className="text-xs text-blue-600">Bags</p>
              <p className="text-lg font-semibold text-blue-700">{bags.toLocaleString()}</p>
            </div>
            <div className="bg-blue-50 p-2 rounded-md">
              <p className="text-xs text-blue-600">Net Weight</p>
              <p className="text-lg font-semibold text-blue-700">{kgs.toLocaleString()} kg</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PurchaseSummaryCard;
