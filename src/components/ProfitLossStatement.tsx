
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { parseISO } from "date-fns";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { useNavigate } from "react-router-dom";
import { formatCurrency, formatDate } from "@/utils/helpers";

interface ProfitData {
  purchase: number;
  sale: number;
  profit: number;
  date: string;
  quantity: number;
  netWeight: number;
  id?: string;
}

interface MonthlyProfitData {
  month: string;
  profit: number;
}

interface ProfitLossStatementProps {
  profitByTransaction: ProfitData[];
  profitByMonth: MonthlyProfitData[];
  totalProfit: number;
}

const ProfitLossStatement = ({ 
  profitByTransaction, 
  profitByMonth, 
  totalProfit 
}: ProfitLossStatementProps) => {
  const [expandedProfitSection, setExpandedProfitSection] = useState(true);
  const navigate = useNavigate();

  const toggleProfitSection = () => {
    setExpandedProfitSection(!expandedProfitSection);
  };

  const handleTransactionClick = (saleId: string) => {
    if (saleId) {
      navigate(`/sales?edit=${saleId}`);
    }
  };

  return (
    <Card className="mt-6 p-4 shadow-md">
      <div 
        className="flex justify-between items-center mb-4 border-b pb-1 cursor-pointer" 
        onClick={toggleProfitSection}
      >
        <h3 className="text-lg font-semibold">Profit & Loss Statement</h3>
        <ChevronRight 
          size={20} 
          className={`transition-transform ${expandedProfitSection ? 'rotate-90' : ''}`} 
        />
      </div>
      
      {expandedProfitSection && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Transaction-wise profit */}
          <div>
            <h4 className="font-medium text-ag-brown mb-2">Transaction-wise</h4>
            <div className="border rounded-md overflow-hidden">
              <div className="bg-gray-50 grid grid-cols-5 font-medium">
                <div className="p-2">Date</div>
                <div className="p-2">Purchase</div>
                <div className="p-2">Sale</div>
                <div className="p-2">Qty (kg)</div>
                <div className="p-2">Profit</div>
              </div>
              <div className="max-h-40 overflow-y-auto">
                {profitByTransaction.length === 0 ? (
                  <div className="p-2 text-center text-gray-500">No transaction data available</div>
                ) : (
                  profitByTransaction.map((item, idx) => (
                    <HoverCard key={idx}>
                      <HoverCardTrigger asChild>
                        <div 
                          className="grid grid-cols-5 border-t cursor-pointer hover:bg-gray-50"
                          onClick={() => item.id && handleTransactionClick(item.id)}
                        >
                          <div className="p-2">{formatDate(item.date)}</div>
                          <div className="p-2">{formatCurrency(item.purchase)}</div>
                          <div className="p-2">{formatCurrency(item.sale)}</div>
                          <div className="p-2">{item.netWeight}</div>
                          <div className={`p-2 ${item.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(item.profit)}
                          </div>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80 p-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold border-b pb-1">Transaction Details</h4>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                            <span className="font-medium">Date:</span>
                            <span>{formatDate(item.date)}</span>
                            
                            <span className="font-medium">Purchase Cost:</span>
                            <span>{formatCurrency(item.purchase)}</span>
                            
                            <span className="font-medium">Sale Revenue:</span>
                            <span>{formatCurrency(item.sale)}</span>
                            
                            <span className="font-medium">Net Weight:</span>
                            <span>{item.netWeight} kg</span>
                            
                            <span className="font-medium">Quantity:</span>
                            <span>{item.quantity} bags</span>
                            
                            <span className="font-medium">Profit/Loss:</span>
                            <span className={item.profit >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                              {formatCurrency(item.profit)}
                            </span>
                          </div>
                          <div className="pt-2 text-xs text-blue-600 mt-2">
                            Click to view full transaction details
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  ))
                )}
              </div>
            </div>
          </div>
          
          {/* Monthly profit */}
          <div>
            <h4 className="font-medium text-ag-brown mb-2">Month-wise</h4>
            <div className="border rounded-md overflow-hidden">
              <div className="bg-gray-50 grid grid-cols-2 font-medium">
                <div className="p-2">Month</div>
                <div className="p-2">Profit</div>
              </div>
              <div className="max-h-40 overflow-y-auto">
                {profitByMonth.length === 0 ? (
                  <div className="p-2 text-center text-gray-500">No monthly data available</div>
                ) : (
                  profitByMonth.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-2 border-t">
                      <div className="p-2">{item.month}</div>
                      <div className={`p-2 ${item.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(item.profit)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Total profit */}
      <div className="mt-4 bg-gray-50 p-3 rounded-md flex justify-between items-center">
        <span className="font-medium">Total Profit/Loss:</span>
        <span className={`font-bold text-xl ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {formatCurrency(totalProfit)}
        </span>
      </div>
    </Card>
  );
};

export default ProfitLossStatement;
