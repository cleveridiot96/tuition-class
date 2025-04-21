
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

  // Ensure summaryData always has valid values
  const safeData = {
    purchases: summaryData?.purchases || { amount: 0, bags: 0, kgs: 0 },
    sales: summaryData?.sales || { amount: 0, bags: 0, kgs: 0 },
    stock: summaryData?.stock || { mumbai: 0, chiplun: 0, sawantwadi: 0 }
  };

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
  }, [safeData.stock]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-full">
      <div className="w-full h-full transform transition-all hover:scale-102">
        <PurchaseSummaryCard {...safeData.purchases} />
      </div>
      <div className="w-full h-full transform transition-all hover:scale-102">
        <SalesSummaryCard {...safeData.sales} />
      </div>
      <div className="w-full h-full transform transition-all hover:scale-102">
        <StockSummaryCard {...safeData.stock} />
      </div>
      <div className="w-full h-full transform transition-all hover:scale-102">
        <CashSummaryCard
          cashBalance={cashBalance}
          todayCashIn={todayCash.cashIn}
          todayCashOut={todayCash.cashOut}
        />
      </div>
      
      <div className="md:col-span-2 w-full h-full transform transition-all hover:scale-102">
        <DashboardCard 
          title="Receivables & Payables"
          onClick={() => navigate('/ledger')}
          className="h-full bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200"
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg shadow-sm border border-blue-200">
              <div className="text-sm text-blue-700">Total Receivables</div>
              <div className="text-2xl font-bold text-blue-600">₹{receivables.toLocaleString()}</div>
              <div className="text-xs text-blue-500 mt-1">From customers</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg shadow-sm border border-red-200">
              <div className="text-sm text-red-700">Total Payables</div>
              <div className="text-2xl font-bold text-red-600">₹{payables.toLocaleString()}</div>
              <div className="text-xs text-red-500 mt-1">To agents, brokers & transporters</div>
            </div>
          </div>
        </DashboardCard>
      </div>
      
      <div className="md:col-span-2 w-full h-full transform transition-all hover:scale-102">
        <DashboardCard 
          title="Stock Summary"
          onClick={() => navigate('/stock')}
          className="h-full bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200"
        >
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-3 rounded-lg shadow-sm border border-amber-200">
              <div className="text-sm text-amber-700">Mumbai</div>
              <div className="text-xl font-bold text-amber-600">
                {safeData.stock.mumbai} bags
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-3 rounded-lg shadow-sm border border-amber-200">
              <div className="text-sm text-amber-700">Chiplun</div>
              <div className="text-xl font-bold text-amber-600">
                {safeData.stock.chiplun} bags
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-3 rounded-lg shadow-sm border border-amber-200">
              <div className="text-sm text-amber-700">Sawantwadi</div>
              <div className="text-xl font-bold text-amber-600">
                {safeData.stock.sawantwadi} bags
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default DashboardSummary;
