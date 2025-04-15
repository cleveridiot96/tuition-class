
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CurrencyRupee, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from '@/utils/helpers';

interface CashBookSummaryProps {
  todaySummary: {
    cashIn: number;
    cashOut: number;
  };
  closingBalance: number;
  lastBalanceType: string;
}

const CashBookSummary: React.FC<CashBookSummaryProps> = ({
  todaySummary,
  closingBalance,
  lastBalanceType
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <h3 className="text-2xl font-bold flex items-center">
                <CurrencyRupee className="h-5 w-5 mr-1" />
                {formatCurrency(closingBalance)} 
                <span className="text-sm ml-2 font-normal text-muted-foreground">
                  {lastBalanceType === 'credit' ? 'CR' : 'DR'}
                </span>
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Today's Cash In</p>
              <h3 className="text-2xl font-bold text-green-600 flex items-center">
                <TrendingUp className="h-5 w-5 mr-1" />
                {formatCurrency(todaySummary.cashIn)}
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Today's Cash Out</p>
              <h3 className="text-2xl font-bold text-red-600 flex items-center">
                <TrendingDown className="h-5 w-5 mr-1" />
                {formatCurrency(todaySummary.cashOut)}
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CashBookSummary;
