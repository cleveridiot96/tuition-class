
import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

interface SummaryData {
  purchases: { amount: number; bags: number; kgs: number };
  sales: { amount: number; bags: number; kgs: number };
  stock: { mumbai: number; chiplun: number; sawantwadi: number };
}

interface DashboardSummaryProps {
  summaryData: SummaryData;
}

const DashboardSummary = ({ summaryData }: DashboardSummaryProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const SummaryCard = ({ 
    title, 
    to, 
    children, 
    className 
  }: { 
    title: string; 
    to: string; 
    children: React.ReactNode; 
    className?: string 
  }) => (
    <Link to={to} className="block hover:opacity-90 transition-opacity">
      <Card className={`p-4 shadow-md hover:shadow-lg transition-shadow ${className || ''}`}>
        <h3 className="text-lg font-semibold mb-2 border-b pb-1">{title}</h3>
        {children}
      </Card>
    </Link>
  );

  const SummaryItem = ({ label, value }: { label: string; value: string | number }) => (
    <div className="text-center">
      <p className="text-sm text-ag-brown">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <SummaryCard title="Purchase Summary" to="/purchases">
          <div className="grid grid-cols-3 gap-2">
            <SummaryItem label="Amount" value={formatCurrency(summaryData.purchases.amount)} />
            <SummaryItem label="Bags" value={summaryData.purchases.bags} />
            <SummaryItem label="Kgs" value={summaryData.purchases.kgs} />
          </div>
        </SummaryCard>
        
        <SummaryCard title="Sales Summary" to="/sales">
          <div className="grid grid-cols-3 gap-2">
            <SummaryItem label="Amount" value={formatCurrency(summaryData.sales.amount)} />
            <SummaryItem label="Bags" value={summaryData.sales.bags} />
            <SummaryItem label="Kgs" value={summaryData.sales.kgs} />
          </div>
        </SummaryCard>
      </div>
      
      <SummaryCard title="Stock Summary" to="/inventory" className="mt-6">
        <div className="grid grid-cols-3 gap-4">
          <SummaryItem label="Mumbai" value={`${summaryData.stock.mumbai} bags`} />
          <SummaryItem label="Chiplun" value={`${summaryData.stock.chiplun} bags`} />
          <SummaryItem label="Sawantwadi" value={`${summaryData.stock.sawantwadi} bags`} />
        </div>
      </SummaryCard>
    </>
  );
};

export default DashboardSummary;
