
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleDollarSign } from 'lucide-react';

interface CashSummaryCardProps {
  cashBalance: number;
  todayCashIn: number;
  todayCashOut: number;
}

const CashSummaryCard: React.FC<CashSummaryCardProps> = ({
  cashBalance,
  todayCashIn,
  todayCashOut
}) => {
  return (
    <Card className="h-full bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 flex flex-row items-center justify-between bg-gradient-to-r from-purple-200 to-purple-100 border-b border-purple-200">
        <CardTitle className="text-lg font-semibold text-purple-800">Cash</CardTitle>
        <CircleDollarSign className="h-5 w-5 text-purple-600" />
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-purple-700">Cash Balance</p>
            <p className="text-2xl font-bold text-purple-800">₹{cashBalance.toLocaleString()}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-purple-50 p-2 rounded-md">
              <p className="text-xs text-purple-600">Today In</p>
              <p className="text-lg font-semibold text-purple-700">₹{todayCashIn.toLocaleString()}</p>
            </div>
            <div className="bg-purple-50 p-2 rounded-md">
              <p className="text-xs text-purple-600">Today Out</p>
              <p className="text-lg font-semibold text-purple-700">₹{todayCashOut.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CashSummaryCard;
