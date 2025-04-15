
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { calculateAccountBalance, getTotalReceivables, getTotalPayables, getTodayCashTransactions, getTotalStockValue } from "@/services/accountingService";
import PurchaseSummaryCard from "./dashboard/PurchaseSummaryCard";
import SalesSummaryCard from "./dashboard/SalesSummaryCard";
import StockSummaryCard from "./dashboard/StockSummaryCard";
import CashSummaryCard from "./dashboard/CashSummaryCard";
import DashboardCard from "./dashboard/DashboardCard";

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

  useEffect(() => {
    try {
      const { total: totalReceivables } = getTotalReceivables();
      setReceivables(totalReceivables);
      
      const { total: totalPayables } = getTotalPayables();
      setPayables(totalPayables);
      
      const todayTransactions = getTodayCashTransactions();
      setTodayCash(todayTransactions);
      
      const cashAccountBalance = calculateAccountBalance('acc-cash');
      setCashBalance(cashAccountBalance.balance);
      
      const totalStockValue = getTotalStockValue();
      setStockValue(totalStockValue);
    } catch (error) {
      console.error("Error loading dashboard summary data:", error);
    }
  }, [summaryData.stock]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-full">
      <div className="w-full h-full">
        <PurchaseSummaryCard {...summaryData.purchases} />
      </div>
      <div className="w-full h-full">
        <SalesSummaryCard {...summaryData.sales} />
      </div>
      <div className="w-full h-full">
        <StockSummaryCard {...summaryData.stock} />
      </div>
      <div className="w-full h-full">
        <CashSummaryCard
          cashBalance={cashBalance}
          todayCashIn={todayCash.cashIn}
          todayCashOut={todayCash.cashOut}
        />
      </div>
      
      <div className="md:col-span-2 w-full h-full">
        <DashboardCard 
          title="Receivables & Payables"
          onClick={() => navigate('/ledger')}
          className="h-full"
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Total Receivables</div>
              <div className="text-2xl font-bold text-blue-600">₹{receivables.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">From customers</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">Total Payables</div>
              <div className="text-2xl font-bold text-red-600">₹{payables.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">To agents, brokers & transporters</div>
            </div>
          </div>
        </DashboardCard>
      </div>
      
      <div className="md:col-span-2 w-full h-full">
        <DashboardCard 
          title="Stock Summary"
          onClick={() => navigate('/stock')}
          className="h-full"
        >
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-amber-50 p-3 rounded-lg">
              <div className="text-sm text-gray-500">Mumbai</div>
              <div className="text-xl font-bold text-amber-600">
                {summaryData.stock.mumbai} bags
              </div>
            </div>
            <div className="bg-amber-50 p-3 rounded-lg">
              <div className="text-sm text-gray-500">Chiplun</div>
              <div className="text-xl font-bold text-amber-600">
                {summaryData.stock.chiplun} bags
              </div>
            </div>
            <div className="bg-amber-50 p-3 rounded-lg">
              <div className="text-sm text-gray-500">Sawantwadi</div>
              <div className="text-xl font-bold text-amber-600">
                {summaryData.stock.sawantwadi} bags
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default DashboardSummary;
