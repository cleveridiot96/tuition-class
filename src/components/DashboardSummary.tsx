
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, ArrowRight, ArrowRightLeft } from "lucide-react";
import { formatCurrency } from "@/utils/helpers";

interface DashboardSummaryProps {
  summaryData: {
    totalSales: number;
    totalPurchases: number;
    totalPayments: number;
    totalReceipts: number;
  };
}

const DashboardSummary = ({ summaryData }: DashboardSummaryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card>
        <CardContent className="p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">Sales</h3>
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <ArrowUp className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold">{formatCurrency(summaryData.totalSales)}</div>
          <p className="text-gray-500 text-sm mt-1">Total sales amount</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">Purchases</h3>
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
              <ArrowDown className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <div className="text-2xl font-bold">{formatCurrency(summaryData.totalPurchases)}</div>
          <p className="text-gray-500 text-sm mt-1">Total purchase amount</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">Receipts</h3>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <ArrowRight className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold">{formatCurrency(summaryData.totalReceipts)}</div>
          <p className="text-gray-500 text-sm mt-1">Total amount received</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">Payments</h3>
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
              <ArrowRightLeft className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div className="text-2xl font-bold">{formatCurrency(summaryData.totalPayments)}</div>
          <p className="text-gray-500 text-sm mt-1">Total amount paid</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSummary;
export type { DashboardSummaryProps };
