
import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardCard from "./DashboardCard";

interface StockSummaryProps {
  mumbai: number;
  chiplun: number;
  sawantwadi: number;
}

const StockSummaryCard = ({ mumbai, chiplun, sawantwadi }: StockSummaryProps) => {
  const navigate = useNavigate();

  return (
    <DashboardCard title="Current Stock" onClick={() => navigate('/inventory')}>
      <div className="text-sm text-gray-500">Stock Value</div>
      <div className="grid grid-cols-3 gap-1 mt-2">
        <div>
          <div className="text-xs text-gray-500">Mumbai</div>
          <div className="text-sm font-semibold">{mumbai.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Chiplun</div>
          <div className="text-sm font-semibold">{chiplun.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Sawantwadi</div>
          <div className="text-sm font-semibold">{sawantwadi.toLocaleString()}</div>
        </div>
      </div>
    </DashboardCard>
  );
};

export default StockSummaryCard;
