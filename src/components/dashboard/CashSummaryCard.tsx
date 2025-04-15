
import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardCard from "./DashboardCard";

interface CashSummaryProps {
  cashBalance: number;
  todayCashIn: number;
  todayCashOut: number;
}

const CashSummaryCard = ({ cashBalance, todayCashIn, todayCashOut }: CashSummaryProps) => {
  const navigate = useNavigate();

  return (
    <DashboardCard title="Cash Position" onClick={() => navigate('/cashbook')}>
      <div className="text-sm text-gray-500">Cash Balance</div>
      <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        ₹{cashBalance.toLocaleString()}
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        <div className="bg-purple-50 p-2 rounded-lg">
          <div className="text-xs text-gray-500">Today's In</div>
          <div className="text-sm font-semibold text-green-600">+₹{todayCashIn.toLocaleString()}</div>
        </div>
        <div className="bg-purple-50 p-2 rounded-lg">
          <div className="text-xs text-gray-500">Today's Out</div>
          <div className="text-sm font-semibold text-red-600">-₹{todayCashOut.toLocaleString()}</div>
        </div>
      </div>
    </DashboardCard>
  );
};

export default CashSummaryCard;
