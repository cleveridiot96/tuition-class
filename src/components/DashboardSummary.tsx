
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { calculateAccountBalance, getTotalReceivables, getTotalPayables, getTodayCashTransactions, getTotalStockValue } from "@/services/accountingService";

interface DashboardSummaryProps {
  summaryData: {
    purchases: { amount: number; bags: number; kgs: number };
    sales: { amount: number; bags: number; kgs: number };
    stock: { mumbai: number; chiplun: number; sawantwadi: number };
  };
}

const DashboardSummary = ({ summaryData }: DashboardSummaryProps) => {
  const [receivables, setReceivables] = useState(0);
  const [payables, setPayables] = useState(0);
  const [todayCash, setTodayCash] = useState({ cashIn: 0, cashOut: 0 });
  const [stockValue, setStockValue] = useState(0);
  const [cashBalance, setCashBalance] = useState(0);

  useEffect(() => {
    try {
      // Get total receivables
      const { total: totalReceivables } = getTotalReceivables();
      setReceivables(totalReceivables);
      
      // Get total payables
      const { total: totalPayables } = getTotalPayables();
      setPayables(totalPayables);
      
      // Get today's cash transactions
      const todayTransactions = getTodayCashTransactions();
      setTodayCash(todayTransactions);
      
      // Get cash account balance
      const cashAccountBalance = calculateAccountBalance('acc-cash');
      setCashBalance(cashAccountBalance.balance);
      
      // Get total stock value
      const totalStockValue = getTotalStockValue();
      setStockValue(totalStockValue);
    } catch (error) {
      console.error("Error loading dashboard summary data:", error);
    }
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="bg-white">
        <CardContent className="p-4 relative">
          <h3 className="text-lg font-medium">Purchase Summary</h3>
          <div className="mt-2">
            <div className="text-sm text-gray-500">Total Purchases</div>
            <div className="text-2xl font-bold">₹{summaryData.purchases.amount.toLocaleString()}</div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <div className="text-xs text-gray-500">Bags</div>
                <div className="text-sm font-semibold">{summaryData.purchases.bags.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Net Weight</div>
                <div className="text-sm font-semibold">{summaryData.purchases.kgs.toLocaleString()} kg</div>
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <svg className="w-8 h-8 text-green-600 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white">
        <CardContent className="p-4 relative">
          <h3 className="text-lg font-medium">Sales Summary</h3>
          <div className="mt-2">
            <div className="text-sm text-gray-500">Total Sales</div>
            <div className="text-2xl font-bold">₹{summaryData.sales.amount.toLocaleString()}</div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <div className="text-xs text-gray-500">Bags</div>
                <div className="text-sm font-semibold">{summaryData.sales.bags.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Net Weight</div>
                <div className="text-sm font-semibold">{summaryData.sales.kgs.toLocaleString()} kg</div>
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <svg className="w-8 h-8 text-blue-600 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white">
        <CardContent className="p-4 relative">
          <h3 className="text-lg font-medium">Current Stock</h3>
          <div className="mt-2">
            <div className="text-sm text-gray-500">Stock Value</div>
            <div className="text-2xl font-bold">₹{stockValue.toLocaleString()}</div>
            <div className="grid grid-cols-3 gap-1 mt-2">
              <div>
                <div className="text-xs text-gray-500">Mumbai</div>
                <div className="text-sm font-semibold">{summaryData.stock.mumbai.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Chiplun</div>
                <div className="text-sm font-semibold">{summaryData.stock.chiplun.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Sawantwadi</div>
                <div className="text-sm font-semibold">{summaryData.stock.sawantwadi.toLocaleString()}</div>
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <svg className="w-8 h-8 text-amber-600 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white">
        <CardContent className="p-4 relative">
          <h3 className="text-lg font-medium">Cash Position</h3>
          <div className="mt-2">
            <div className="text-sm text-gray-500">Cash Balance</div>
            <div className="text-2xl font-bold">₹{cashBalance.toLocaleString()}</div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <div className="text-xs text-gray-500">Today's In</div>
                <div className="text-sm font-semibold text-green-600">+₹{todayCash.cashIn.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Today's Out</div>
                <div className="text-sm font-semibold text-red-600">-₹{todayCash.cashOut.toLocaleString()}</div>
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <svg className="w-8 h-8 text-purple-600 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Second row with receivables and payables */}
      <Card className="bg-white md:col-span-2">
        <CardContent className="p-4 relative">
          <h3 className="text-lg font-medium">Receivables & Payables</h3>
          <div className="grid grid-cols-2 gap-8 mt-4">
            <div>
              <div className="text-sm text-gray-500">Total Receivables</div>
              <div className="text-2xl font-bold text-blue-600">₹{receivables.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">From customers</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Payables</div>
              <div className="text-2xl font-bold text-red-600">₹{payables.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">To agents, brokers & transporters</div>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <svg className="w-8 h-8 text-gray-400 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white md:col-span-2">
        <CardContent className="p-4 relative">
          <h3 className="text-lg font-medium">Business Statistics</h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <div className="text-sm text-gray-500">Profit Margin</div>
              <div className="text-2xl font-bold text-green-600">
                {summaryData.purchases.amount > 0 
                  ? `${(((summaryData.sales.amount - summaryData.purchases.amount) / summaryData.purchases.amount) * 100).toFixed(1)}%`
                  : '0%'
                }
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Avg. Purchase Rate</div>
              <div className="text-2xl font-bold">
                {summaryData.purchases.kgs > 0 
                  ? `₹${(summaryData.purchases.amount / summaryData.purchases.kgs).toFixed(2)}/kg`
                  : '₹0/kg'
                }
              </div>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <svg className="w-8 h-8 text-green-400 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSummary;
