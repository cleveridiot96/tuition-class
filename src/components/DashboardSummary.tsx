import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { calculateAccountBalance, getTotalReceivables, getTotalPayables, getTodayCashTransactions, getTotalStockValue } from "@/services/accountingService";

interface DashboardSummaryProps {
  summaryData: {
    purchases: { amount: number; bags: number; kgs: number };
    sales: { amount: number; bags: number; kgs: number };
    stock: { mumbai: number; chiplun: number; sawantwadi: number };
  };
}

const DashboardSummary = ({ summaryData }: DashboardSummaryProps) => {
  const navigate = useNavigate();
  const [receivables, setReceivables] = useState(0);
  const [payables, setPayables] = useState(0);
  const [todayCash, setTodayCash] = useState({ cashIn: 0, cashOut: 0 });
  const [stockValue, setStockValue] = useState(0);
  const [cashBalance, setCashBalance] = useState(0);
  const [stockWeights, setStockWeights] = useState({
    mumbai: 0,
    chiplun: 0,
    sawantwadi: 0
  });

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
      
      // Estimate weights based on stock quantities
      // Assuming average bag weight of 50 kg
      setStockWeights({
        mumbai: summaryData.stock.mumbai * 50,
        chiplun: summaryData.stock.chiplun * 50,
        sawantwadi: summaryData.stock.sawantwadi * 50
      });
    } catch (error) {
      console.error("Error loading dashboard summary data:", error);
    }
  }, [summaryData.stock]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 overflow-visible">
      <Button
        variant="card"
        onClick={() => navigate('/purchases')}
        className="group"
      >
        <CardContent className="p-4 relative w-full">
          <h3 className="text-lg font-medium group-hover:text-[#9b87f5]">Purchase Summary</h3>
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
          </div>
        </CardContent>
      </Button>

      <Button
        variant="card"
        onClick={() => navigate('/sales')}
        className="group"
      >
        <CardContent className="p-4 relative w-full">
          <h3 className="text-lg font-medium group-hover:text-[#9b87f5]">Sales Summary</h3>
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
          </div>
        </CardContent>
      </Button>

      <Button
        variant="card"
        onClick={() => navigate('/inventory')}
        className="group"
      >
        <CardContent className="p-4 relative w-full">
          <h3 className="text-lg font-medium group-hover:text-[#9b87f5]">Current Stock</h3>
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
          </div>
        </CardContent>
      </Button>

      <Button
        variant="card"
        onClick={() => navigate('/cashbook')}
        className="group"
      >
        <CardContent className="p-4 relative w-full">
          <h3 className="text-lg font-medium group-hover:text-[#9b87f5]">Cash Position</h3>
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
          </div>
        </CardContent>
      </Button>

      <Button
        variant="card"
        onClick={() => navigate('/ledger')}
        className="md:col-span-2 group"
      >
        <CardContent className="p-4 relative w-full">
          <h3 className="text-lg font-medium group-hover:text-[#9b87f5]">Receivables & Payables</h3>
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
        </CardContent>
      </Button>

      <Button
        variant="card"
        onClick={() => navigate('/stock')}
        className="md:col-span-2 group"
      >
        <CardContent className="p-4 relative w-full">
          <h3 className="text-lg font-medium group-hover:text-[#9b87f5]">Stock Summary</h3>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <div className="text-sm text-gray-500">Mumbai</div>
              <div className="text-xl font-bold text-amber-600">
                {summaryData.stock.mumbai} bags
              </div>
              <div className="text-sm font-semibold mt-1">
                ~{stockWeights.mumbai.toLocaleString()} kg
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Chiplun</div>
              <div className="text-xl font-bold text-amber-600">
                {summaryData.stock.chiplun} bags
              </div>
              <div className="text-sm font-semibold mt-1">
                ~{stockWeights.chiplun.toLocaleString()} kg
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Sawantwadi</div>
              <div className="text-xl font-bold text-amber-600">
                {summaryData.stock.sawantwadi} bags
              </div>
              <div className="text-sm font-semibold mt-1">
                ~{stockWeights.sawantwadi.toLocaleString()} kg
              </div>
            </div>
          </div>
        </CardContent>
      </Button>
    </div>
  );
};

export default DashboardSummary;
