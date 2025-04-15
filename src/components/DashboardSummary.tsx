
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 overflow-visible">
      <PurchaseSummaryCard {...summaryData.purchases} />
      <SalesSummaryCard {...summaryData.sales} />
      <StockSummaryCard {...summaryData.stock} />
      <CashSummaryCard
        cashBalance={cashBalance}
        todayCashIn={todayCash.cashIn}
        todayCashOut={todayCash.cashOut}
      />
      <DashboardCard 
        className="md:col-span-2" 
        title="Receivables & Payables"
        onClick={() => navigate('/ledger')}
      >
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
      </DashboardCard>
      <DashboardCard 
        className="md:col-span-2" 
        title="Stock Summary"
        onClick={() => navigate('/stock')}
      >
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <div className="text-sm text-gray-500">Mumbai</div>
            <div className="text-xl font-bold text-amber-600">
              {summaryData.stock.mumbai} bags
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Chiplun</div>
            <div className="text-xl font-bold text-amber-600">
              {summaryData.stock.chiplun} bags
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Sawantwadi</div>
            <div className="text-xl font-bold text-amber-600">
              {summaryData.stock.sawantwadi} bags
            </div>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
};

export default DashboardSummary;
