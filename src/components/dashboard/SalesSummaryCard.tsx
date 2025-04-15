
import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardCard from "./DashboardCard";

interface SalesSummaryProps {
  amount: number;
  bags: number;
  kgs: number;
}

const SalesSummaryCard = ({ amount, bags, kgs }: SalesSummaryProps) => {
  const navigate = useNavigate();

  return (
    <DashboardCard title="Sales Summary" onClick={() => navigate('/sales')}>
      <div className="text-sm text-gray-500">Total Sales</div>
      <div className="text-2xl font-bold">₹{amount.toLocaleString()}</div>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div>
          <div className="text-xs text-gray-500">Bags</div>
          <div className="text-sm font-semibold">{bags.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Net Weight</div>
          <div className="text-sm font-semibold">{kgs.toLocaleString()} kg</div>
        </div>
      </div>
    </DashboardCard>
  );
};

export default SalesSummaryCard;
