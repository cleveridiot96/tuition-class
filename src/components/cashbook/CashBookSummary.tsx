
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatBalance } from "@/utils/helpers";

interface CashBookSummaryProps {
  todaySummary: {
    cashIn: number;
    cashOut: number;
  };
  closingBalance: number;
  lastBalanceType: string;
}

const CashBookSummary = ({ todaySummary, closingBalance, lastBalanceType }: CashBookSummaryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="bg-green-50">
        <CardContent className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Today's Cash In</div>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(todaySummary.cashIn)}</div>
        </CardContent>
      </Card>
      <Card className="bg-red-50">
        <CardContent className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Today's Cash Out</div>
          <div className="text-2xl font-bold text-red-600">{formatCurrency(todaySummary.cashOut)}</div>
        </CardContent>
      </Card>
      <Card className="bg-blue-50">
        <CardContent className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Net Balance</div>
          <div className="text-2xl font-bold text-blue-600">{formatCurrency(todaySummary.cashIn - todaySummary.cashOut)}</div>
        </CardContent>
      </Card>
      <Card className="bg-purple-50">
        <CardContent className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Total Cash Balance</div>
          <div className="text-2xl font-bold text-purple-600">{formatBalance(closingBalance, lastBalanceType)}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CashBookSummary;
